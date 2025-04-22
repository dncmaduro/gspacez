import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  CopyButton,
  Divider,
  Flex,
  Group,
  Image,
  Stack,
  Text,
  Tooltip
} from '@mantine/core'
import { IPost } from '../../hooks/interface'
import { useEffect, useMemo, useState } from 'react'
import { previewTags } from '../../utils/tags'
import { GIcon } from './GIcon'
import { Link } from '@tanstack/react-router'
import { usePost } from '../../hooks/usePost'
import { useMutation } from '@tanstack/react-query'
import { ReactPostRequest } from '../../hooks/models'
import { GLikeButton } from './GLikeButton'
import { GDislikeButton } from './GDislikeButton'
import { GCommentButton } from './GCommentButton'
import { GToast } from './GToast'

interface Props {
  post: IPost
}

export const GPost = ({ post }: Props) => {
  const { visibleTags, restTags } = useMemo(
    () => previewTags(post.hashTags),
    [post]
  )
  const [liked, setLiked] = useState(post.liked)
  const [disliked, setDisliked] = useState(post.disliked)
  const otherLike = post.totalLike - (post.liked ? 1 : 0)
  const otherDislike = post.totalDislike - (post.disliked ? 1 : 0)
  const [prevReact, setPrevReact] = useState<'liked' | 'dislike' | undefined>()
  const [isHovered, setIsHovered] = useState(false)

  const { reactPost } = usePost()

  const { mutate: react } = useMutation({
    mutationKey: ['react', post.id],
    mutationFn: ({ req }: { req: ReactPostRequest }) => reactPost(post.id, req),
    onSuccess: () => {
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
    setPrevReact(post.liked ? 'liked' : post.disliked ? 'dislike' : undefined)
  }, [post])

  const handleLike = () => {
    setLiked(!liked)
    if (disliked) setDisliked(false)
    react({
      req: {
        reactType: 'LIKE'
      }
    })
  }

  const handleDislike = () => {
    setDisliked(!disliked)
    if (liked) setLiked(false)
    react({
      req: {
        reactType: 'DISLIKE'
      }
    })
  }

  return (
    <Box
      className="w-full rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-indigo-400 hover:bg-[#f8f9ff] hover:shadow-lg"
      px={0}
      py={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/post/${post.id}`} className="block w-full">
        {post.previewImage && (
          <Box className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={post.previewImage}
              className="h-full w-full object-cover transition-transform duration-500 ease-in-out"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            />
            <Box className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <Badge color="indigo" radius="sm">
                @{post.squad.tagName}
              </Badge>
            </Box>
          </Box>
        )}

        <Box px={24} py={16}>
          <Group justify="apart" mb={12}>
            <Group>
              <Avatar
                src={post.avatarUrl}
                className="border-2 border-indigo-200"
                radius="xl"
              />
              <Stack gap={0}>
                <Text className="!font-bold">{post.profileName}</Text>
                <Text size="xs" c="dimmed">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>
              </Stack>
            </Group>
          </Group>

          <Text
            className={`${post.previewImage ? 'min-h-[auto]' : 'min-h-[48px]'} overflow-wrap !text-xl leading-tight !font-bold break-words whitespace-normal`}
            title={post.title}
            style={{
              wordBreak: 'break-word',
              hyphens: 'auto',
              maxWidth: '100%'
            }}
          >
            {post.title}
          </Text>

          <Box mt={12} mb={8}>
            <Flex wrap="wrap" gap={8}>
              {visibleTags.map((tag, index) => (
                <Badge
                  size="sm"
                  variant="outline"
                  color="gray"
                  key={index}
                  style={{ textTransform: 'initial' }}
                >
                  # {tag}
                </Badge>
              ))}
              {restTags > 0 && (
                <Badge size="sm" variant="outline" color="gray">
                  +{restTags}
                </Badge>
              )}
            </Flex>
          </Box>
        </Box>
      </Link>

      <Divider />

      <Flex justify="space-between" px={24} py={12} align="center">
        <GLikeButton
          onClick={handleLike}
          quantity={otherLike + (liked ? 1 : 0)}
          isLiked={liked}
        />
        <GDislikeButton
          onClick={handleDislike}
          quantity={otherDislike + (disliked ? 1 : 0)}
          isDisliked={disliked}
        />
        <GCommentButton postId={post.id} />

        <CopyButton value={`${window.location.origin}/post/${post.id}`}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Copy post link'}>
              <ActionIcon
                variant="subtle"
                size="lg"
                color="gray.9"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  copy()
                }}
              >
                <GIcon name="Link" size={20} />
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Flex>
    </Box>
  )
}
