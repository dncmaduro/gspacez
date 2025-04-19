import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip
} from '@mantine/core'
import { IComment } from '../../hooks/interface'
import ReactMarkdown from 'react-markdown'
import { GIcon } from '../common/GIcon'
import { useDisclosure } from '@mantine/hooks'
import { Link } from '@tanstack/react-router'
import { convertTime } from '../../utils/convertTime'
import { FormProvider, useForm } from 'react-hook-form'
import { CommentForm } from './CommentForm'
import { usePost } from '../../hooks/usePost'
import { CreateCommentRequest } from '../../hooks/models'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GDislikeButton } from '../common/GDislikeButton'

interface Props {
  comment: IComment
  children: IComment[]
  postId: string
}

export type CommentFormType = {
  text: string
  hashTags?: string[]
}

export const Comment = ({ comment, children, postId }: Props) => {
  const [opened, { toggle }] = useDisclosure(false)
  const [openedReply, { toggle: toggleReply }] = useDisclosure(false)
  const { createComment } = usePost()
  const queryClient = useQueryClient()

  const formMethods = useForm<CommentFormType>({
    defaultValues: {
      text: '',
      hashTags: []
    }
  })

  const { mutate: mutateCreateComment, isPending: isPosting } = useMutation({
    mutationKey: ['createComment'],
    mutationFn: ({ req }: { req: CreateCommentRequest }) => {
      return createComment(postId, req)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-comments', postId]
      })
      toggleReply()
      reset()
    }
  })

  const {
    handleSubmit,
    formState: { isDirty },
    reset
  } = formMethods

  const submit = (values: CommentFormType) => {
    const req: CreateCommentRequest = {
      comment: {
        parentId: comment.id,
        content: values
      }
    }

    mutateCreateComment({ req })
  }

  return (
    <Stack gap={12} className="">
      <Flex align="center" gap={16}>
        <Avatar
          src={comment.profileImageUrl}
          component={Link}
          to={`/profile/${comment.profileId}`}
          size="md"
          radius="xl"
          className="border-2 border-indigo-100 transition-all duration-200 hover:border-indigo-300"
        />
        <Stack gap={1}>
          <Text
            component={Link}
            to={`/profile/${comment.profileId}`}
            fw={600}
            className="text-indigo-900 transition-colors duration-200 hover:text-indigo-600"
          >
            {comment.profileName}
          </Text>
          <Text c="dimmed" size="sm">
            {convertTime(
              new Date(comment.createdAt),
              comment.updatedAt ? new Date(comment.updatedAt) : null
            )}
          </Text>
        </Stack>
      </Flex>

      <Box className="rounded-lg bg-gray-50 p-3">
        <ReactMarkdown className="prose prose-sm prose-indigo max-w-none">
          {comment.content.text}
        </ReactMarkdown>
      </Box>

      <Group className="mt-2">
        {children.length > 0 && (
          <Button
            variant="subtle"
            leftSection={
              <GIcon name={opened ? 'ChevronUp' : 'ChevronDown'} size={14} />
            }
            size="compact-sm"
            className="w-fit font-medium"
            color="indigo"
            onClick={toggle}
          >
            {opened ? 'Hide' : 'Show'} {children.length}{' '}
            {children.length === 1 ? 'reply' : 'replies'}
          </Button>
        )}
        <Tooltip label="Like">
          <ActionIcon
            size="md"
            variant="light"
            color="blue"
            radius="xl"
            className="transition-transform duration-200 hover:scale-110"
          >
            <GIcon name="ThumbUp" size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Dislike">
          <GDislikeButton onClick={() => {}} quantity={0} isDisliked={false} />
        </Tooltip>
        <Tooltip label="Reply">
          <ActionIcon
            size="md"
            variant="light"
            color="indigo"
            radius="xl"
            onClick={toggleReply}
            className="transition-transform duration-200 hover:scale-110"
          >
            <GIcon name="Message" size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Collapse in={openedReply} animateOpacity>
        <Box mt={8} className="p-3">
          <FormProvider {...formMethods}>
            <CommentForm />
          </FormProvider>
          <Group justify="flex-end" mt={12}>
            <Button
              variant="subtle"
              color="gray"
              onClick={toggleReply}
              disabled={isPosting}
            >
              Cancel
            </Button>
            <Button
              disabled={!isDirty}
              loading={isPosting}
              onClick={handleSubmit(submit)}
              leftSection={<GIcon name="Send" size={16} />}
            >
              Reply
            </Button>
          </Group>
        </Box>
      </Collapse>

      {opened && children.length > 0 && (
        <Divider
          w="100%"
          my={8}
          color="indigo.1"
          labelPosition="center"
          label={
            <Text size="xs" c="dimmed">
              Replies
            </Text>
          }
        />
      )}

      <Collapse in={opened} animateOpacity>
        <Stack ml={32} mt={8} gap={16}>
          {children.map((reply) => (
            <Paper
              key={reply.id}
              shadow="xs"
              p="md"
              radius="md"
              withBorder
              className="border-indigo-100 transition-shadow duration-200 hover:shadow-sm"
            >
              <Flex align="center" gap={16}>
                <Avatar
                  src={reply.profileImageUrl}
                  size="md"
                  radius="xl"
                  component={Link}
                  to={`/profile/${reply.profileId}`}
                  className="border-2 border-indigo-100 transition-all duration-200 hover:border-indigo-300"
                />
                <Stack gap={1}>
                  <Text
                    component={Link}
                    to={`/profile/${reply.profileId}`}
                    fw={600}
                    className="text-indigo-900 transition-colors duration-200 hover:text-indigo-600"
                  >
                    {reply.profileName}
                  </Text>
                  <Text c="dimmed" size="sm">
                    {convertTime(
                      new Date(reply.createdAt),
                      reply.updatedAt ? new Date(reply.updatedAt) : null
                    )}
                  </Text>
                </Stack>
              </Flex>

              <Box className="mt-3 rounded-lg bg-gray-50 p-3">
                <ReactMarkdown className="prose prose-sm prose-indigo max-w-none">
                  {reply.content.text}
                </ReactMarkdown>
              </Box>

              <Group className="mt-2">
                <Tooltip label="Like">
                  <ActionIcon
                    size="md"
                    variant="light"
                    color="blue"
                    radius="xl"
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    <GIcon name="ThumbUp" size={18} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Dislike">
                  <GDislikeButton
                    onClick={() => {}}
                    quantity={0}
                    isDisliked={false}
                  />
                </Tooltip>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}
