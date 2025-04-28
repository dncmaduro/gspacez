import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useFeedback } from '../../hooks/useFeedback'
import { Box, Button, Flex, Paper, Rating, Stack, Text } from '@mantine/core'
import { format } from 'date-fns'
import { GIcon } from '../common/GIcon'
import { GToast } from '../common/GToast'
import { useState } from 'react'

export const OwnFeedbacks = () => {
  const { getOwnFeedback, deleteFeedback } = useFeedback()
  const queryClient = useQueryClient()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: ownFeedback } = useQuery({
    queryKey: ['get-own-feedback'],
    queryFn: () => getOwnFeedback(),
    select: (data) => {
      return data.data.result
    }
  })

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteFeedback(id),
    onSuccess: () => {
      GToast.success({
        title: 'Delete feedback successfully!'
      })
      queryClient.invalidateQueries({ queryKey: ['get-own-feedback'] })
      setDeletingId(null)
    },
    onError: () => {
      GToast.error({
        title: 'Delete feedback failed!'
      })
      setDeletingId(null)
    }
  })

  const handleDelete = (id: string) => {
    setDeletingId(id)
    remove(id)
  }

  return (
    <Stack>
      {ownFeedback?.length ? (
        ownFeedback.map((feedback) => (
          <Paper
            p={24}
            radius="md"
            withBorder
            className="border-indigo-200 bg-indigo-50/50"
            key={feedback.id}
          >
            <Stack gap={16}>
              <Flex align="center" justify="space-between">
                <Text fw={600} size="lg">
                  Feedback at {format(new Date(feedback.createdAt), 'PP')}
                </Text>
                <Rating value={feedback.rate} readOnly size="md" />
              </Flex>
              <Box className="rounded-md border border-indigo-100 bg-white p-3">
                <Text>{feedback.content}</Text>
              </Box>
              <Button
                leftSection={<GIcon name="Trash" />}
                color="red"
                variant="subtle"
                className="self-end"
                size="xs"
                onClick={() => handleDelete(feedback.id)}
                loading={deletingId === feedback.id}
              >
                Delete this feedback
              </Button>
            </Stack>
          </Paper>
        ))
      ) : (
        <Text c={'dimmed'} mt={20} mx={'auto'}>
          You haven't given any feedback yet.
        </Text>
      )}
    </Stack>
  )
}
