import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  CopyButton,
  Flex,
  Stack,
  Text,
  Tooltip
} from '@mantine/core'
import { IPost } from '../../hooks/interface'
import { useMemo, useState } from 'react'
import { previewTags } from '../../utils/tags'
import { GIcon } from './GIcon'
import { Link } from '@tanstack/react-router'
import { usePost } from '../../hooks/usePost'
import { useMutation } from '@tanstack/react-query'
import { ReactPostRequest } from '../../hooks/models'
import { GLikeButton } from './GLikeButton'
import { GDislikeButton } from './GDislikeButton'
import { GCommentButton } from './GCommentButton'

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
  const [totalLikes, setTotalLikes] = useState(post.totalLike)
  const [totalDislikes, setTotalDislikes] = useState(post.totalDislike)

  const { reactPost } = usePost()

  const { mutate: react } = useMutation({
    mutationKey: ['react', post.id],
    mutationFn: ({ req }: { req: ReactPostRequest }) => reactPost(post.id, req),
    onSuccess: (response) => {
      if (!response.data.result.currentReact) {
        setLiked(false)
        setDisliked(false)
      } else {
        setLiked(response.data.result.currentReact === 'LIKE')
        setDisliked(response.data.result.currentReact === 'DISLIKE')
        setTotalLikes(response.data.result.totalLikes)
        setTotalDislikes(response.data.result.totalDislikes)
      }
    }
  })

  return (
    <Box
      className="w-full cursor-pointer rounded-lg border border-indigo-200 shadow-md hover:border-indigo-400"
      px={24}
      bg={'white'}
      py={16}
    >
      <Link to={`/post/${post.id}`} className="w-full">
        <Stack gap={4}>
          <Avatar src={post.avatarUrl} className="border border-indigo-200" />
          <Text
            className="min-h-[48px] truncate !text-xl !font-bold"
            title={post.title}
          >
            {post.title}
          </Text>
          <Box h={40} mt={12}>
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
                  + {restTags}
                </Badge>
              )}
            </Flex>
          </Box>
        </Stack>
      </Link>
      <Flex justify="space-between" mt={16} align="center">
        <GLikeButton
          onClick={() => {
            react({
              req: {
                reactType: liked ? undefined : 'LIKE'
              }
            })
          }}
          quantity={totalLikes}
          isLiked={liked}
        />
        <GDislikeButton
          onClick={() => {
            react({
              req: {
                reactType: disliked ? undefined : 'DISLIKE'
              }
            })
          }}
          quantity={totalDislikes}
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
                onClick={copy}
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
