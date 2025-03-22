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
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { ReactPostRequest } from '../../hooks/models'

interface Props {
  post: IPost
}

export const GPost = ({ post }: Props) => {
  const { visibleTags, restTags } = useMemo(
    () => previewTags(post.hashTags),
    [post]
  )
  const token = useSelector((state: RootState) => state.auth.token)
  const [liked, setLiked] = useState(post.liked)
  const [disliked, setDisliked] = useState(post.disliked)

  const { reactPost } = usePost()

  const { mutate: react } = useMutation({
    mutationKey: ['react', post.id],
    mutationFn: ({ req }: { req: ReactPostRequest }) =>
      reactPost(post.id, req, token),
    onSuccess: (response) => {
      if (!response.data.result.currentReact) {
        setLiked(false)
        setDisliked(false)
      } else {
        setLiked(response.data.result.currentReact.reactType === 'LIKE')
        setDisliked(response.data.result.currentReact.reactType === 'DISLIKE')
      }
    }
  })

  return (
    <Box
      className="w-full cursor-pointer rounded-lg border border-indigo-200 shadow-md hover:border-indigo-400"
      px={24}
      py={16}
    >
      <Link to={`/post/${post.id}`} className="w-full">
        <Stack gap={4}>
          <Avatar src={post.avatarUrl} className="border border-indigo-200" />
          <Text className="!text-xl !font-bold">{post.title}</Text>
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
      <Flex justify="space-between" mt={16}>
        <ActionIcon
          variant="subtle"
          size="lg"
          color={liked ? 'blue' : 'gray.9'}
          onClick={() => {
            react({
              req: {
                reactType: liked ? undefined : 'LIKE'
              }
            })
          }}
        >
          <GIcon name="ThumbUp" size={24} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          size="lg"
          color={disliked ? 'red' : 'gray.9'}
          onClick={() => {
            react({
              req: {
                reactType: disliked ? undefined : 'DISLIKE'
              }
            })
          }}
        >
          <GIcon name="ThumbDown" size={24} />
        </ActionIcon>
        <ActionIcon variant="subtle" size="lg" color="gray.9">
          <GIcon name="Message" size={24} />
        </ActionIcon>

        <CopyButton value={`${window.location.origin}/post/${post.id}`}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Copy post link'}>
              <ActionIcon
                variant="subtle"
                size="lg"
                color="gray.9"
                onClick={copy}
              >
                <GIcon name="Link" size={24} />
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Flex>
    </Box>
  )
}
