import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { createFileRoute, useParams, Link } from '@tanstack/react-router'
import { useDiscussion } from '../../hooks/useDiscussion'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  Progress,
  Stack,
  Text
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { GLikeButton } from '../../components/common/GLikeButton'
import { GDislikeButton } from '../../components/common/GDislikeButton'
import {
  CreateDiscussionCommentRequest,
  VotePollRequest
} from '../../hooks/models'
import { FormProvider, useForm } from 'react-hook-form'
import { CommentFormType } from '../post/$postId'
import { CommentForm } from '../../components/post/CommentForm'
import { GDiscussionComment } from '../../components/common/GDiscussionComment'

export const Route = createFileRoute('/discussions/$discussionId')({
  component: RouteComponent
})

function RouteComponent() {
  const discussionId = useParams({ from: Route.fullPath }).discussionId
  const {
    getDetailDiscussion,
    getDiscussionComments,
    votePoll,
    createDiscussionComment
  } = useDiscussion()
  const queryClient = useQueryClient()

  const { data: commentsData, isLoading: isCommentsLoading } = useInfiniteQuery(
    {
      queryKey: ['get-discussion-comments', discussionId],
      queryFn: ({ pageParam }) =>
        getDiscussionComments(discussionId, { page: pageParam, size: 10 }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.data.result.number + 1 < lastPage.data.result.totalPages
          ? lastPage.data.result.number + 1
          : undefined
      },
      select: (data) => {
        return data.pages.map((page) => page.data.result.content).flat()
      }
    }
  )

  const { data: discussionData, isLoading: isDiscussionLoading } = useQuery({
    queryKey: ['get-detail-discussion', discussionId],
    queryFn: () => getDetailDiscussion(discussionId),
    select: (data) => {
      return data.data.result
    }
  })

  const { mutate: mutateVote } = useMutation({
    mutationFn: (req: VotePollRequest) => votePoll(discussionId, req),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-detail-discussion', discussionId]
      })
    }
  })

  const formMethods = useForm<CommentFormType>({
    defaultValues: {
      text: ''
    }
  })

  const { mutate: mutateComment, isPending: issCreatingComment } = useMutation({
    mutationFn: (req: CreateDiscussionCommentRequest) =>
      createDiscussionComment(discussionId, req),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-discussion-comments', discussionId]
      })
      reset()
    }
  })

  if (isDiscussionLoading) {
    return (
      <AppLayout>
        <Flex justify="center" align="center" h="70vh">
          <Loader size="lg" color="indigo" />
        </Flex>
      </AppLayout>
    )
  }

  const submit = (values: CommentFormType) => {
    const req: CreateDiscussionCommentRequest = {
      commentContent: values.text
    }

    mutateComment(req)
  }

  const {
    handleSubmit,
    formState: { isDirty },
    reset
  } = formMethods

  return (
    <AppLayout>
      <Box w="100%" maw={800} mx="auto" mt={32} px={16}>
        {discussionData && (
          <Stack gap={24}>
            {/* Back Button */}
            <Button
              variant="light"
              leftSection={<GIcon name="ArrowLeft" size={16} />}
              component={Link}
              to="/discussions"
              w="fit-content"
            >
              Back to Discussions
            </Button>

            {/* Header */}
            <Paper shadow="xs" p="lg" radius="md" withBorder>
              <Stack gap={16}>
                <Group justify="space-between" wrap="nowrap">
                  <Text className="text-2xl font-bold text-indigo-800">
                    {discussionData.title}
                  </Text>
                  <Group gap={8}>
                    {discussionData.voteResponse && (
                      <Badge color="orange" variant="light" radius="sm">
                        Vote
                      </Badge>
                    )}
                    {!discussionData.isOpen && (
                      <Badge color="gray" variant="light" radius="sm">
                        Closed
                      </Badge>
                    )}
                  </Group>
                </Group>

                <Group>
                  <Avatar
                    src={discussionData.avatarUrl}
                    size="md"
                    radius="xl"
                    color="indigo"
                  >
                    {!discussionData.avatarUrl && (
                      <GIcon name="User" size={20} />
                    )}
                  </Avatar>
                  <Box>
                    <Text fw={500}>
                      {discussionData.profileName || discussionData.profileTag}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Posted on{' '}
                      {format(new Date(discussionData.createdAt), 'PPpp')}
                    </Text>
                  </Box>
                </Group>

                <Divider />

                {/* Content */}
                <Box className="prose prose-indigo max-w-none">
                  <ReactMarkdown>{discussionData.content}</ReactMarkdown>
                </Box>

                {/* Tags */}
                {discussionData.hashTags.length > 0 && (
                  <Group gap={8} mt={8}>
                    {discussionData.hashTags.map((tag, index) => (
                      <Badge key={index} color="indigo" variant="light">
                        #{tag}
                      </Badge>
                    ))}
                  </Group>
                )}

                {/* Actions */}
                <Group mt={8}>
                  <GLikeButton
                    onClick={() => {}}
                    quantity={10}
                    isLiked={false}
                  />
                  <GDislikeButton
                    onClick={() => {}}
                    quantity={2}
                    isDisliked={false}
                  />
                  <Button
                    variant="light"
                    leftSection={<GIcon name="Share" size={16} />}
                    size="sm"
                    color="gray"
                  >
                    Share
                  </Button>
                </Group>
              </Stack>
            </Paper>

            {/* Vote Section */}
            {discussionData.voteResponse && (
              <Paper shadow="xs" p="lg" radius="md" withBorder>
                <Stack gap={16}>
                  <Text fw={600} size="lg">
                    {discussionData.voteResponse.title}
                  </Text>
                  <Stack gap={12}>
                    {discussionData.voteResponse.options.map((option) => (
                      <Box key={option.id}>
                        <Group justify="apart" mb={4}>
                          <Text size="sm">{option.value}</Text>
                          <Badge variant="light" size="sm" fw={500}>
                            {option.percentage} %
                          </Badge>
                        </Group>
                        <Group gap={8} wrap="nowrap">
                          <Progress
                            value={parseFloat(option.percentage)}
                            color={
                              discussionData.voteResponse?.selectedOptionId ===
                              option.id
                                ? 'indigo'
                                : 'gray'
                            }
                            size="lg"
                            radius="xl"
                            style={{ flex: 1 }}
                          />
                          <Button
                            variant={
                              discussionData.voteResponse?.selectedOptionId ===
                              option.id
                                ? 'filled'
                                : 'light'
                            }
                            color="indigo"
                            size="xs"
                            disabled={
                              !discussionData.isOpen ||
                              discussionData.voteResponse?.selectedOptionId ===
                                option.id
                            }
                            onClick={() => mutateVote({ optionId: option.id })}
                          >
                            Vote
                          </Button>
                        </Group>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            )}

            {/* Comments Section */}
            <Paper shadow="xs" p="lg" radius="md" withBorder>
              <Stack gap={16}>
                <Text fw={600} size="lg">
                  Comments
                </Text>

                {/* Comment Form */}
                <Box>
                  <FormProvider {...formMethods}>
                    <CommentForm />
                  </FormProvider>
                </Box>

                <Group justify="flex-end" mt={16}>
                  <Button
                    disabled={!isDirty}
                    loading={issCreatingComment}
                    onClick={handleSubmit(submit)}
                    leftSection={<GIcon name="Send" size={18} />}
                    radius="md"
                  >
                    Post comment
                  </Button>
                </Group>

                <Divider />

                {/* Comments List */}
                {isCommentsLoading ? (
                  <Flex justify="center" p={20}>
                    <Loader size="sm" />
                  </Flex>
                ) : commentsData && commentsData.length > 0 ? (
                  <Stack gap={16}>
                    {commentsData.map((comment) => (
                      <GDiscussionComment comment={comment} key={comment.id} />
                    ))}
                  </Stack>
                ) : (
                  <Flex
                    justify="center"
                    direction="column"
                    align="center"
                    py={20}
                  >
                    <GIcon name="MessageCircle" size={48} color="#E5E7EB" />
                    <Text c="dimmed" mt={8}>
                      No comments yet. Be the first to comment!
                    </Text>
                  </Flex>
                )}
              </Stack>
            </Paper>
          </Stack>
        )}
      </Box>
    </AppLayout>
  )
}
