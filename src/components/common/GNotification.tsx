import { Avatar, Box, Group, Stack, Text, Flex } from '@mantine/core'
import { useMemo } from 'react'
import { INotification } from '../../hooks/interface'
import { GIcon } from './GIcon'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'

interface Props {
  notification: INotification
}

export const GNotification = ({ notification }: Props) => {
  const notiContent = useMemo(() => {
    if (notification.type === 'COMMENT') {
      return {
        title: (
          <span>
            <b>{notification.entity.sender.profileName}</b> has left a comment
            on your post
          </span>
        ),
        href: `/post/${notification.entity.postId}`
      }
    }

    if (notification.type === 'LIKE') {
      return {
        title: (
          <span>
            <b>{notification.entity.sender.profileName}</b> has liked your post
          </span>
        ),
        href: `/post/${notification.entity.postId}`
      }
    }

    if (notification.type === 'DISLIKE') {
      return {
        title: (
          <span>
            <b>{notification.entity.sender.profileName}</b> has disliked your
            post
          </span>
        ),
        href: `/post/${notification.entity.postId}`
      }
    }

    return { title: <></>, href: '.' }
  }, [notification])

  return (
    <Link to={notiContent.href}>
      <Box className="rounded-lg p-3 transition-colors duration-200 hover:bg-indigo-50">
        <Group justify="apart" align="flex-start">
          <Group align="flex-start" gap="sm">
            <Avatar
              size="md"
              src={notification.entity.sender.profileImageUrl}
              className="border border-gray-300"
            />
            <Stack gap={4}>
              {notiContent.title}
              <Flex align="center" gap={6}>
                <GIcon name="Clock" size={14} color="gray" />
                <Text size="xs" c="dimmed">
                  {format(new Date(notification.createdAt), 'PP')}
                </Text>
              </Flex>
            </Stack>
          </Group>
        </Group>
      </Box>
    </Link>
  )
}
