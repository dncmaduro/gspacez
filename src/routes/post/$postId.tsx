import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useParams,
  useRouter
} from '@tanstack/react-router'
import { usePost } from '../../hooks/usePost'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Group,
  Loader,
  Text
} from '@mantine/core'
import ReactMarkdown from 'react-markdown'
import { GIcon } from '../../components/common/GIcon'
import { ReactNode } from 'react'
import { useMe } from '../../hooks/useMe'
import { FormProvider, useForm } from 'react-hook-form'
import { CommentForm } from '../../components/post/CommentForm'
import { useDisclosure } from '@mantine/hooks'
import { CreateCommentRequest } from '../../hooks/models'
import { PostComments } from '../../components/post/PostComments'

export const Route = createFileRoute('/post/$postId')({
  component: RouteComponent
})

export type CommentFormType = {
  text: string
}

function RouteComponent() {
  const { postId } = useParams({ from: `/post/$postId` })
  const [opened, { toggle }] = useDisclosure(false)
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()

  const { getPost, createComment } = usePost()
  const me = useMe()
  console.log(me)

  const { data, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => {
      return getPost({ id: postId }, token)
    }
  })

  const postData = data?.data.result

  const privacyIcons: Record<string, ReactNode> = {
    PUBLIC: <GIcon name="World" size={16} color="gray" />,
    PRIVATE: <GIcon name="LockFilled" size={16} color="gray" />
  }

  const formMethods = useForm<CommentFormType>({
    defaultValues: {
      text: ''
    }
  })

  const {
    handleSubmit,
    formState: { isDirty }
  } = formMethods

  const { mutate: mutateCreateComment, isPending: isPosting } = useMutation({
    mutationKey: ['createComment'],
    mutationFn: ({ req }: { req: CreateCommentRequest }) => {
      return createComment(postId, req, token)
    }
  })

  const submit = (values: CommentFormType) => {
    const req: CreateCommentRequest = {
      comment: {
        parentId: '',
        content: values
      }
    }

    mutateCreateComment({ req })
  }

  return (
    <AppLayout>
      <Box mx="auto" px={12}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <ActionIcon
              variant="subtle"
              onClick={() => router.history.go(-1)}
              size="md"
            >
              <GIcon name="ArrowLeft" size={20} />
            </ActionIcon>
            <Group justify="space-between" mt={16}>
              <Flex align="center" gap={8}>
                <Avatar src={postData?.avatarUrl} size="md" />
                <Text className="!text-lg">
                  {postData?.profileName || 'Name Name'}
                </Text>
                <GIcon name="PointFilled" size={8} color="gray" />
                <span>{privacyIcons[postData?.privacy || 'PUBLIC']}</span>
              </Flex>
              <Button
                component={Link}
                to={`/post/edit/${postId}`}
                variant="outline"
                leftSection={<GIcon name="Pencil" size={18} />}
              >
                Edit post
              </Button>
            </Group>
            <Text className="!text-2xl !font-bold" mt={16}>
              {postData?.title || 'Title'}
            </Text>
            <Box
              mt={14}
              className="rounded-lg border border-gray-200"
              px={16}
              py={20}
            >
              <ReactMarkdown>{postData?.content.text || ''}</ReactMarkdown>
            </Box>
            <Divider mt={32} mb={16} />
            <Box
              className="w-fit rounded-lg border border-gray-200"
              mt={14}
              p={6}
            >
              <Group gap={32}>
                <ActionIcon variant="subtle" color="gray" size="lg">
                  <GIcon name="ThumbUp" size={24} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" size="lg">
                  <GIcon name="ThumbDown" size={24} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" size="lg">
                  <GIcon name="Message" size={24} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" size="lg">
                  <GIcon name="Link" size={24} />
                </ActionIcon>
              </Group>
            </Box>
            <Button
              variant="light"
              size="md"
              onClick={toggle}
              w="100%"
              mt={32}
              leftSection={<GIcon name="Message" size={20} />}
            >
              Share your thoughts
            </Button>
            <Collapse in={opened}>
              <FormProvider {...formMethods}>
                <CommentForm />
              </FormProvider>
              <Button
                mt={8}
                disabled={!isDirty}
                loading={isPosting}
                className="self-end"
                onClick={handleSubmit(submit)}
              >
                Post
              </Button>
            </Collapse>
            <Box mt={16}>
              <PostComments />
            </Box>
          </>
        )}
      </Box>
    </AppLayout>
  )
}
