import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Stack,
  Text,
  Badge
} from '@mantine/core'
import { IPost } from '../../hooks/interface'
import { format } from 'date-fns'
import { DATE_SIMPLE_FORMAT } from '../../utils/constants'
import ReactMarkdown from 'react-markdown'
import { GIcon } from './GIcon'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

interface Props {
  post: IPost
}

export const GSimplePost = ({ post }: Props) => {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    if (disliked) setDisliked(false)
  }

  const handleDislike = () => {
    setDisliked(!disliked)
    if (liked) setLiked(false)
  }

  return (
    <Box
      className="rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:border-indigo-200"
      p={16}
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
          className="border-2 border-indigo-100"
        />
        <Stack gap={1} align="flex-start">
          <Group gap={8} align="center">
            <Text fw={600} className="text-gray-800">
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

      <Box
        mt={12}
        className="prose prose-sm prose-headings:text-indigo-700 prose-a:text-indigo-600 max-w-none text-gray-700"
      >
        <ReactMarkdown>{post.content.text}</ReactMarkdown>
      </Box>

      <Group mt={24} gap={32} className="border-t border-gray-100 pt-3">
        <ActionIcon
          variant={liked ? 'filled' : 'subtle'}
          color={liked ? 'indigo' : 'gray'}
          size="sm"
          onClick={handleLike}
          className="transition-all duration-200"
        >
          <GIcon name="ThumbUp" />
        </ActionIcon>

        <ActionIcon
          variant={disliked ? 'filled' : 'subtle'}
          color={disliked ? 'red' : 'gray'}
          size="sm"
          onClick={handleDislike}
          className="transition-all duration-200"
        >
          <GIcon name="ThumbDown" />
        </ActionIcon>

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
