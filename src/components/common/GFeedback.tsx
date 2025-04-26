import { Avatar, Box, Card, Group, Rating, Text } from '@mantine/core'
import { format } from 'date-fns'
import { GIcon } from './GIcon'

interface Props {
  feedback: {
    id: string
    profileId: string
    content: string
    rate: number
    createdAt: string
  }
}

export const GFeedback = ({ feedback }: Props) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-4">
      <Group justify="space-between" mb="md">
        <Group>
          <Avatar color="indigo" radius="xl">
            <GIcon name="User" size={24} />
          </Avatar>
          <div>
            <Text size="sm" fw={500} c="dimmed">
              User Feedback
            </Text>
            <Text size="xs" c="dimmed">
              {format(new Date(feedback.createdAt), 'PPp')}
            </Text>
          </div>
        </Group>
        <Rating value={feedback.rate} readOnly />
      </Group>

      <Box className="rounded-md bg-gray-50 p-3">
        <Text>{feedback.content}</Text>
      </Box>
    </Card>
  )
}
