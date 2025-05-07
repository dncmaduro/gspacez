import {
  ActionIcon,
  Avatar,
  Box,
  Flex,
  Group,
  Stack,
  Text,
  Tooltip
} from '@mantine/core'
import { IDiscussionComment } from '../../hooks/interface'
import { Link } from '@tanstack/react-router'
import { GIcon } from './GIcon'
import { useDiscussion } from '../../hooks/useDiscussion'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

interface Props {
  comment: IDiscussionComment
}

export const GDiscussionComment = ({ comment: initComment }: Props) => {
  const { upvoteComment } = useDiscussion()
  const [comment, setComment] = useState<IDiscussionComment>(initComment)

  const { mutate: upvote } = useMutation({
    mutationFn: () => upvoteComment(comment.id),
    onSuccess: (response) => {
      setComment(response.data.result)
    }
  })

  return (
    <Box
      className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
      p={16}
    >
      <Flex align="flex-start" gap={16}>
        {/* Avatar */}
        <Avatar
          src={comment.avatarUrl}
          size="md"
          radius="xl"
          component={Link}
          to={`/profile/${comment.profileTag}`}
          className="border-2 border-indigo-100 transition-all duration-200 hover:border-indigo-300"
        />

        <Stack gap={8} style={{ flex: 1 }}>
          {/* Header */}
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Text
                component={Link}
                to={`/profile/${comment.profileTag}`}
                fw={600}
                className="text-indigo-900 transition-colors duration-200 hover:text-indigo-600"
              >
                {comment.profileName}
              </Text>
            </Stack>

            {/* Actions */}
            <Group gap={8}>
              <Tooltip label="Upvote">
                <ActionIcon
                  size="md"
                  variant="light"
                  color="blue"
                  radius="xl"
                  onClick={() => upvote()}
                >
                  <GIcon
                    name={comment.isUpvote ? 'ThumbUpFilled' : 'ThumbUp'}
                    size={16}
                  />
                </ActionIcon>
              </Tooltip>
              <Text c="indigo" size="sm">
                {comment.totalUpvote}
              </Text>
            </Group>
          </Group>

          {/* Content */}
          <Box className="rounded-md bg-gray-50 p-3">
            <Text>{comment.content}</Text>
          </Box>
        </Stack>
      </Flex>
    </Box>
  )
}
