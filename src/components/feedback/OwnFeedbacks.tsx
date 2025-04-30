import { useQuery } from '@tanstack/react-query'
import { useFeedback } from '../../hooks/useFeedback'
import { Stack, Text } from '@mantine/core'
import { OwnFeedback } from './OwnFeedback'

export const OwnFeedbacks = () => {
  const { getOwnFeedback } = useFeedback()

  const { data: ownFeedback } = useQuery({
    queryKey: ['get-own-feedback'],
    queryFn: () => getOwnFeedback(),
    select: (data) => {
      return data.data.result
    }
  })

  return (
    <Stack>
      {ownFeedback?.length ? (
        ownFeedback.map((feedback) => (
          <OwnFeedback feedback={feedback} key={feedback.id} />
        ))
      ) : (
        <Text c={'dimmed'} mt={20} mx={'auto'}>
          You haven't given any feedback yet.
        </Text>
      )}
    </Stack>
  )
}
