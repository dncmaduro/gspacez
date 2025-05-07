import { Box, Button, Flex, Paper, Rating, Stack, Text } from '@mantine/core'
import { format } from 'date-fns'
import { GIcon } from '../common/GIcon'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFeedback } from '../../hooks/useFeedback'
import { GToast } from '../common/GToast'
import { useDark } from '../../hooks/useDark'

interface Props {
  feedback: {
    id: string
    profileId: string
    content: string
    rate: number
    createdAt: string
  }
}

export const OwnFeedback = ({ feedback }: Props) => {
  const queryClient = useQueryClient()
  const { isDark } = useDark()

  const { deleteFeedback } = useFeedback()

  const { mutate: remove, isPending } = useMutation({
    mutationFn: () => deleteFeedback(feedback.id),
    onSuccess: () => {
      GToast.success({
        title: 'Delete feedback successfully!'
      })
      queryClient.invalidateQueries({ queryKey: ['get-own-feedback'] })
    },
    onError: () => {
      GToast.error({
        title: 'Delete feedback failed!'
      })
    }
  })

  const handleDelete = () => {
    remove()
  }

  return (
    <Paper
      p={24}
      radius="md"
      withBorder
      className={`border-indigo-200 ${isDark ? 'bg-indigo-700/50' : 'bg-indigo-50/50'}`}
      key={feedback.id}
    >
      <Stack gap={16}>
        <Flex align="center" justify="space-between">
          <Text fw={600} size="lg">
            Feedback at {format(new Date(feedback.createdAt), 'PP')}
          </Text>
          <Rating value={feedback.rate} readOnly size="md" />
        </Flex>
        <Box
          className="rounded-md border border-indigo-100 p-3"
          bg={isDark ? 'gray.8' : 'gray.0'}
        >
          <Text>{feedback.content}</Text>
        </Box>
        <Button
          leftSection={<GIcon name="Trash" />}
          color="red"
          variant="subtle"
          className="self-end"
          size="xs"
          onClick={() => handleDelete()}
          loading={isPending}
        >
          Delete this feedback
        </Button>
      </Stack>
    </Paper>
  )
}
