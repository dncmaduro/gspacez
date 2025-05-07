import { Avatar, Badge, Box, Flex, Group, Text } from '@mantine/core'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { GIcon } from './GIcon'
import { IDiscussion } from '../../hooks/interface'

interface Props {
  discussion: IDiscussion
}

export const GDiscussion = ({ discussion }: Props) => {
  return (
    <Box
      className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-md"
      component={Link}
      to={`/discussions/${discussion.id}`}
    >
      <Flex direction="column" gap={12}>
        <Group justify="space-between" align="center">
          <Text fw={500} className="text-xl font-bold text-indigo-800">
            {discussion.title}
          </Text>
          {discussion.voteResponse && (
            <Badge color="orange" variant="light" radius="sm">
              Vote
            </Badge>
          )}
          {!discussion.isOpen && (
            <Badge color="gray" variant="light" radius="sm">
              Closed
            </Badge>
          )}
        </Group>

        <Text lineClamp={2} size="sm" c="dimmed" className="leading-relaxed">
          {discussion.content}
        </Text>

        {discussion.hashTags.length > 0 && (
          <Group gap={4} mt={4}>
            {discussion.hashTags.slice(0, 3).map((tag, index) => (
              <Badge key={index} color="indigo" variant="light" size="sm">
                #{tag}
              </Badge>
            ))}
            {discussion.hashTags.length > 3 && (
              <Text size="xs" c="dimmed">
                +{discussion.hashTags.length - 3} more
              </Text>
            )}
          </Group>
        )}

        <Group mt={8} justify="space-between">
          <Group gap={8}>
            <Avatar
              src={discussion.avatarUrl}
              size="sm"
              radius="xl"
              color="indigo"
            >
              {!discussion.avatarUrl && <GIcon name="User" size={16} />}
            </Avatar>
            <Text size="sm" fw={500}>
              {discussion.profileName || discussion.profileTag}
            </Text>
          </Group>

          <Group gap={16}>
            <Group gap={4}>
              <GIcon name="Calendar" size={16} color="#6B7280" />
              <Text size="xs" c="dimmed">
                {format(new Date(discussion.createdAt), 'PP')}
              </Text>
            </Group>
          </Group>
        </Group>
      </Flex>
    </Box>
  )
}
