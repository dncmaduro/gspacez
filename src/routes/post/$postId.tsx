import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useParams,
  useRouter,
  useSearch
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
  Text,
  Tooltip
} from '@mantine/core'
import ReactMarkdown from 'react-markdown'
import { GIcon } from '../../components/common/GIcon'
import { ReactNode, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { CommentForm } from '../../components/post/CommentForm'
import { useDisclosure } from '@mantine/hooks'
import { CreateCommentRequest, ReactPostRequest } from '../../hooks/models'
import { PostComments } from '../../components/post/PostComments'
import { GLikeButton } from '../../components/common/GLikeButton'
import { GDislikeButton } from '../../components/common/GDislikeButton'

export const Route = createFileRoute('/post/$postId')({
  component: RouteComponent,
  validateSearch: (search) =>
    search as {
      comment?: boolean
    }
})

export type CommentFormType = {
  text: string
}

function RouteComponent() {
  const params = useSearch({ strict: false })
  const { postId } = useParams({ from: `/post/$postId` })
  const [opened, { toggle }] = useDisclosure(params.comment ? true : false)
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { getPost, createComment, reactPost } = usePost()

  const {
    data: postData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => {
      return getPost({ id: postId }, token)
    },
    select: (data) => {
      return data.data.result
    }
  })

  const { mutate: react } = useMutation({
    mutationKey: ['react', postData?.id],
    mutationFn: ({ req }: { req: ReactPostRequest }) =>
      reactPost(postData?.id || '', req, token),
    onSuccess: () => {
      refetch()
    }
  })

  useEffect(() => {
    if (opened) {
      const textarea = document.getElementById('comment-textarea')
      textarea?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [opened])

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
    formState: { isDirty },
    reset
  } = formMethods

  const { mutate: mutateCreateComment, isPending: isPosting } = useMutation({
    mutationKey: ['createComment'],
    mutationFn: ({ req }: { req: CreateCommentRequest }) => {
      return createComment(postId, req, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-comments', postId]
      })
      toggle()
      reset()
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

  const [tooltipText, setTooltipText] = useState<string>('Copy link to post')

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setTooltipText('Copied!')
      setTimeout(() => setTooltipText('Copy link to post'), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      setTooltipText('Failed to copy')
      setTimeout(() => setTooltipText('Copy link to post'), 2000)
    }
  }

  return (
    <AppLayout>
      <Box mx="auto" maw={1000} px={12}>
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
                <Link to={`/profile/${postData?.profileId}`}>
                  <Group>
                    <Avatar src={postData?.avatarUrl} size="md" />
                    <Text className="!text-lg">
                      {postData?.profileName || 'Name Name'}
                    </Text>
                  </Group>
                </Link>
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
            <Text className="!text-2xl !font-bold" mt={24}>
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
                <GLikeButton
                  onClick={() => {
                    react({
                      req: {
                        reactType: postData?.liked ? undefined : 'LIKE'
                      }
                    })
                  }}
                  quantity={postData?.totalLike || 0}
                  isLiked={postData?.liked || false}
                />
                <GDislikeButton
                  onClick={() => {
                    react({
                      req: {
                        reactType: postData?.disliked ? undefined : 'DISLIKE'
                      }
                    })
                  }}
                  quantity={postData?.totalDislike || 0}
                  isDisliked={postData?.disliked || false}
                />
                <Tooltip label={tooltipText} position="bottom" withArrow>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="lg"
                    onClick={handleCopyLink}
                  >
                    <GIcon name="Link" size={24} />
                  </ActionIcon>
                </Tooltip>
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
