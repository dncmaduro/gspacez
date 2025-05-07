import { Avatar, Box, Button, Group, Stack, Text, Badge } from '@mantine/core'
import { IPost } from '../../hooks/interface'
import { format } from 'date-fns'
import { DATE_SIMPLE_FORMAT } from '../../utils/constants'
import ReactMarkdown from 'react-markdown'
import { GIcon } from './GIcon'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { GLikeButton } from './GLikeButton'
import { usePost } from '../../hooks/usePost'
import { useMutation } from '@tanstack/react-query'
import { ReactPostRequest } from '../../hooks/models'
import { GDislikeButton } from './GDislikeButton'
import { GToast } from './GToast'
import { useDark } from '../../hooks/useDark'

interface Props {
  post: IPost
}

export const GSimplePost = ({ post }: Props) => {
  const [liked, setLiked] = useState(post.liked)
  const [disliked, setDisliked] = useState(post.disliked)
  const otherLike = post.totalLike - (post.liked ? 1 : 0)
  const otherDislike = post.totalDislike - (post.disliked ? 1 : 0)
  const [prevReact, setPrevReact] = useState<'liked' | 'dislike' | undefined>()
  const { reactPost } = usePost()

  const { mutate: react } = useMutation({
    mutationKey: ['react', post.id],
    mutationFn: ({ req }: { req: ReactPostRequest }) =>
      reactPost(post.id || '', req),
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

  const { isDark } = useDark()

  return (
    <Box
      className={`rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300 ${isDark ? 'hover:border-indigo-700' : 'hover:border-indigo-200'}`}
      p={16}
      bg={isDark ? 'gray.9' : 'white'}
      w={'100%'}
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)'
        }
      }}
    >
      <Group>
        <Avatar
          src={post.avatarUrl}
          radius="xl"
          size="md"
          className="cursor-pointer border-2 border-indigo-100 transition-all duration-200 hover:border-indigo-300 hover:shadow-md"
          component={Link}
          to={`/profile/${post.profileTag}`}
        />
        <Stack gap={1} align="flex-start">
          <Group gap={8} align="center">
            <Text
              fw={600}
              className="cursor-pointer text-gray-800 hover:text-indigo-600"
              component={Link}
              to={`/profile/${post.profileTag}`}
            >
              {post.profileName}
            </Text>
            {post.hashTags && post.hashTags[0] && (
              <Badge size="xs" color="indigo" variant="light">
                {post.hashTags[0]}
              </Badge>
            )}
          </Group>
          <Text size="xs" c="dimmed" className="flex items-center gap-1">
            <GIcon name="Clock" size={12} />
            {format(new Date(post.updatedAt), DATE_SIMPLE_FORMAT)}
          </Text>
        </Stack>
      </Group>

      {post.title && (
        <Text fw={700} size="lg" className="mt-4 mb-2 text-indigo-900">
          {post.title}
        </Text>
      )}

      <Box
        mt={12}
        className={`prose prose-sm ${isDark ? 'prose-headings:text-indigo-200 prose-a:text-indigo-300' : 'prose-headings:text-indigo-700 prose-a:text-indigo-600'} max-w-none ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
      >
        <ReactMarkdown>{post.content.text}</ReactMarkdown>
      </Box>

      <Group mt={24} gap={32} className="border-t border-gray-100 pt-3">
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

        <Button
          variant="light"
          leftSection={<GIcon name="EyeSearch" />}
          size="xs"
          component={Link}
          to={`/post/${post.id}`}
          className="ml-auto transition-colors duration-200 hover:bg-indigo-50"
        >
          View post
        </Button>
      </Group>
    </Box>
  )
}
