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
import ReactMarkdown from 'react-markdown'
import { useDark } from '../../hooks/useDark'

interface Props {
  comment: IDiscussionComment
  isClose?: boolean
}

export const GDiscussionComment = ({
  comment: initComment,
  isClose
}: Props) => {
  const { upvoteComment } = useDiscussion()
  const [comment, setComment] = useState<IDiscussionComment>(initComment)

  const { mutate: upvote } = useMutation({
    mutationFn: () => upvoteComment(comment.id),
    onSuccess: (response) => {
      setComment(response.data.result)
    }
  })

  const { isDark } = useDark()

  return (
    <Box
      className={`rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-sm transition-shadow duration-200 hover:shadow-md`}
      bg={isDark ? 'gray.9' : 'white'}
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
                  disabled={isClose}
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
          <Box className="rounded-md p-3" bg={isDark ? 'gray.8' : 'gray.0'}>
            <ReactMarkdown>{comment.content}</ReactMarkdown>
          </Box>
        </Stack>
      </Flex>
    </Box>
  )
}
