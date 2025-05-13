import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
  useRouter,
  useSearch
} from '@tanstack/react-router'
import { usePost } from '../../hooks/usePost'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Group,
  Image,
  Loader,
  Menu,
  Paper,
  Popover,
  Stack,
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
import { useMe } from '../../hooks/useMe'
import { GToast } from '../../components/common/GToast'
import { useMedia } from '../../hooks/useMedia'
import { useDark } from '../../hooks/useDark'
import { modals } from '@mantine/modals'
import { Summary } from '../../components/post/Summary'

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
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [prevReact, setPrevReact] = useState<'liked' | 'dislike' | undefined>()
  const queryClient = useQueryClient()
  const { isMobile } = useMedia()
  const navigate = useNavigate()

  const { getPost, createComment, reactPost, deletePost } = usePost()
  const { data: profileData } = useMe()

  const {
    data: postData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => {
      return getPost({ id: postId })
    },
    select: (data) => {
      return data.data.result
    }
  })

  useEffect(() => {
    setLiked(postData?.liked || false)
    setDisliked(postData?.disliked || false)
    setPrevReact(
      postData?.liked ? 'liked' : postData?.disliked ? 'dislike' : undefined
    )
  }, [postData])

  const { mutate: react } = useMutation({
    mutationKey: ['react', postData?.id],
    mutationFn: ({ req }: { req: ReactPostRequest }) =>
      reactPost(postData?.id || '', req),
    onSuccess: () => {
      refetch()
      setPrevReact(liked ? 'liked' : disliked ? 'dislike' : undefined)
    },
    onError: () => {
      GToast.error({
        title: 'React failed!'
      })
      setLiked(prevReact === 'liked' ? true : false)
      setDisliked(prevReact === 'dislike' ? true : false)
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
      return createComment(postId, req)
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
      setTooltipText('Failed to copy')
      setTimeout(() => setTooltipText('Copy link to post'), 2000)
    }
  }

  const { mutate: handleDelete } = useMutation({
    mutationKey: ['delete-post'],
    mutationFn: () => {
      return deletePost(postId)
    },
    onSuccess: () => {
      GToast.success({
        title: 'Delete post successfully!'
      })
      navigate({ to: '/app' })
    },
    onError: () => {
      GToast.error({
        title: 'Delete post failed!'
      })
    }
  })

  const hashtags = postData?.hashTags
  const { isDark } = useDark()

  return (
    <AppLayout>
      <Box
        mx="auto"
        bg={isDark ? 'gray.9' : 'white'}
        maw={1000}
        className="min-h-screen rounded-lg shadow-sm"
      >
        {isLoading ? (
          <Flex h="70vh" align="center" justify="center">
            <Loader size="lg" color="indigo" />
          </Flex>
        ) : (
          <Box className={`p-${isMobile ? '3' : '6'}`}>
            <Flex align="center" gap={8} mb={isMobile ? 16 : 24}>
              <Tooltip label="Go to previous page">
                <ActionIcon
                  variant="light"
                  onClick={() => router.history.go(-1)}
                  size="lg"
                  radius="xl"
                  color="indigo"
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <GIcon name="ArrowLeft" size={20} />
                </ActionIcon>
              </Tooltip>
              <Text c="dimmed" size="sm">
                Back to previous page
              </Text>
            </Flex>

            <Paper
              shadow="sm"
              radius="md"
              p={isMobile ? 'sm' : 'xl'}
              withBorder
              className={isDark ? 'border-indigo-800' : 'border-indigo-100'}
            >
              <Group justify="space-between" mb={24}>
                <Flex align="center" gap={12}>
                  <Link to={`/profile/${postData?.profileTag}`}>
                    <Avatar
                      src={postData?.avatarUrl}
                      size="lg"
                      radius="xl"
                      className="border-2 border-indigo-100 transition-all duration-200 hover:border-indigo-300 hover:shadow-md"
                    />
                  </Link>
                  <Stack gap={2}>
                    <Link to={`/profile/${postData?.profileTag}`}>
                      <Text className="text-xl font-semibold text-indigo-900 transition-colors duration-200 hover:text-indigo-600">
                        {postData?.profileName || 'Name Name'}
                      </Text>
                    </Link>
                    <Flex align="center" gap={8}>
                      <Text c="dimmed" size="sm">
                        {new Date(postData?.createdAt || '').toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }
                        )}
                      </Text>
                      <GIcon name="PointFilled" size={6} color="gray" />
                      <Tooltip
                        label={
                          postData?.privacy === 'PRIVATE'
                            ? 'Private post'
                            : 'Public post'
                        }
                      >
                        <span>
                          {privacyIcons[postData?.privacy || 'PUBLIC']}
                        </span>
                      </Tooltip>
                    </Flex>
                  </Stack>
                </Flex>
                {profileData?.id === postData?.profileId && (
                  <Menu>
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        size="lg"
                        radius="xl"
                        color="indigo"
                      >
                        <GIcon name="Dots" size={20} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        component={Link}
                        to={`/post/edit/${postId}`}
                        leftSection={<GIcon name="Pencil" size={16} />}
                        className="rounded-md py-2 hover:bg-indigo-50"
                      >
                        Edit post
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<GIcon name="Trash" size={16} />}
                        color="red"
                        onClick={() =>
                          modals.openConfirmModal({
                            title: <b>Delete post</b>,
                            children: (
                              <Text>Are you sure to delete this post?</Text>
                            ),
                            onConfirm: () => {
                              handleDelete()
                              modals.closeAll()
                            },
                            onCancel: () => modals.closeAll(),
                            labels: {
                              confirm: 'Delete',
                              cancel: 'Cancel'
                            },
                            confirmProps: { color: 'red' }
                          })
                        }
                        className="rounded-md py-2 hover:bg-red-50"
                      >
                        Delete post
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Group>

              <Text className="!mb-6 !text-3xl !font-bold !text-indigo-900">
                {postData?.title || 'Title'}
              </Text>

              {/* Hashtags section */}
              <Flex justify={'space-between'}>
                <Group gap="md" mb={16}>
                  <Link to={`/squad/${postData?.squad.tagName}`}>
                    <Group
                      gap={8}
                      className={`rounded-full border ${isDark ? 'border-gray-800' : 'border-gray-100'} bg-gray-50 px-3 py-1 transition-colors hover:bg-indigo-50`}
                      bg={isDark ? 'gray.8' : 'gray.0'}
                    >
                      <Avatar src={postData?.squad.avatarUrl} />
                      <Text>{postData?.squad.name}</Text>
                    </Group>
                  </Link>
                  {hashtags && hashtags.length > 0 && (
                    <>
                      {hashtags.map((tag: string) => (
                        <Badge
                          color="indigo"
                          variant="outline"
                          radius="xl"
                          size="sm"
                          key={tag}
                          style={{ textTransform: 'initial' }}
                        >
                          # {tag}
                        </Badge>
                      ))}
                    </>
                  )}
                </Group>
                <Popover
                  withArrow
                  width={400}
                  position="bottom-start"
                  shadow="md"
                >
                  <Popover.Target>
                    <Button
                      variant="gradient"
                      radius={'xl'}
                      gradient={{ from: 'violet', to: 'pink' }}
                    >
                      Summarize it
                    </Button>
                  </Popover.Target>

                  <Popover.Dropdown p={16}>
                    <Summary content={postData?.content.text || ''} />
                  </Popover.Dropdown>
                </Popover>
              </Flex>

              {postData?.previewImage && (
                <Box
                  className={`mb-8 overflow-hidden rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <Image
                    src={postData?.previewImage}
                    className="w-full transition-transform duration-500 hover:scale-105"
                  />
                </Box>
              )}

              <Paper
                shadow="xs"
                radius="md"
                p="xl"
                withBorder
                className={`mb-8 ${isDark ? 'border-gray-700' : 'border-gray-200'} bg-gray-50`}
              >
                <Box className="prose prose-lg prose-indigo max-w-none">
                  <ReactMarkdown>{postData?.content.text || ''}</ReactMarkdown>
                </Box>
              </Paper>

              <Divider
                my={32}
                color="indigo.1"
                labelPosition="center"
                label={
                  <Text size="sm" c="dimmed" fw={500}>
                    Reactions
                  </Text>
                }
              />

              <Flex justify="space-between" align="center" mb={32}>
                <Paper shadow="xs" radius="xl" p="md" withBorder>
                  <Group gap={24}>
                    <GLikeButton
                      onClick={() => {
                        setLiked(!liked)
                        if (disliked) setDisliked(false)
                        react({
                          req: {
                            reactType: postData?.liked ? undefined : 'LIKE'
                          }
                        })
                      }}
                      quantity={postData?.totalLike || 0 + (liked ? 1 : 0)}
                      isLiked={liked}
                    />
                    <GDislikeButton
                      onClick={() => {
                        setDisliked(!disliked)
                        if (liked) setLiked(false)
                        react({
                          req: {
                            reactType: postData?.disliked
                              ? undefined
                              : 'DISLIKE'
                          }
                        })
                      }}
                      quantity={
                        postData?.totalDislike || 0 + (disliked ? 1 : 0)
                      }
                      isDisliked={disliked}
                    />
                    <Tooltip label={tooltipText} position="bottom" withArrow>
                      <ActionIcon
                        variant="light"
                        color="indigo"
                        size="lg"
                        radius="xl"
                        onClick={handleCopyLink}
                        className="transition-transform duration-200 hover:scale-110"
                      >
                        <GIcon name="Link" size={20} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Paper>

                <Group>
                  {isMobile ? (
                    <ActionIcon
                      variant={opened ? 'filled' : 'light'}
                      size="xl"
                      radius="xl"
                      onClick={toggle}
                      color="indigo"
                      className="transition-transform duration-200 hover:scale-110"
                    >
                      <GIcon name="Message" size={20} />
                    </ActionIcon>
                  ) : (
                    <Button
                      variant={opened ? 'filled' : 'light'}
                      size="md"
                      onClick={toggle}
                      radius="xl"
                      leftSection={<GIcon name="Message" size={20} />}
                      className="transition-all duration-200 hover:shadow-md"
                      color="indigo"
                    >
                      {opened ? 'Hide comment form' : 'Share your thoughts'}
                    </Button>
                  )}
                </Group>
              </Flex>

              <Collapse in={opened} animateOpacity>
                <FormProvider {...formMethods}>
                  <CommentForm />
                </FormProvider>
                <Group justify="flex-end" mt={16}>
                  <Button
                    variant="subtle"
                    color="gray"
                    onClick={toggle}
                    disabled={isPosting}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!isDirty}
                    loading={isPosting}
                    onClick={handleSubmit(submit)}
                    leftSection={<GIcon name="Send" size={18} />}
                    radius="md"
                  >
                    Post comment
                  </Button>
                </Group>
              </Collapse>

              <Divider
                my={32}
                color="indigo.1"
                labelPosition="center"
                label={
                  <Text size="sm" c="dimmed" fw={500}>
                    Comments
                  </Text>
                }
              />

              <Box>
                <PostComments />
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </AppLayout>
  )
}
