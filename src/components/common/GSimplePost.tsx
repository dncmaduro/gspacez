import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Stack,
  Text
} from '@mantine/core'
import { IPost } from '../../hooks/interface'
import { format } from 'date-fns'
import { DATE_SIMPLE_FORMAT } from '../../utils/constants'
import ReactMarkdown from 'react-markdown'
import { GIcon } from './GIcon'
import { Link } from '@tanstack/react-router'

interface Props {
  post: IPost
}

export const GSimplePost = ({ post }: Props) => {
  return (
    <Box className="rounded-lg border border-gray-300" p={16}>
      <Group>
        <Avatar src={post.avatarUrl} />
        <Stack gap={1} align="flex-start">
          <Text>{post.profileName}</Text>
          <Text size="xs" c="dimmed">
            {format(new Date(post.updatedAt), DATE_SIMPLE_FORMAT)}
          </Text>
        </Stack>
      </Group>
      <Box mt={8}>
        <ReactMarkdown>{post.content.text}</ReactMarkdown>
      </Box>
      <Group mt={24} gap={32}>
        <ActionIcon variant="subtle" color="gray" size="sm">
          <GIcon name="ThumbUp" />
        </ActionIcon>
        <ActionIcon variant="subtle" color="gray" size="sm">
          <GIcon name="ThumbDown" />
        </ActionIcon>
        <Button
          variant="light"
          leftSection={<GIcon name="EyeSearch" />}
          size="xs"
          component={Link}
          to={`/post/${post.id}`}
        >
          View post
        </Button>
      </Group>
    </Box>
  )
}
