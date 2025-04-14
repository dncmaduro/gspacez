import { useQuery } from '@tanstack/react-query'
import { useSquad } from '../../../hooks/useSquad'
import { Box, ScrollArea, Stack } from '@mantine/core'
import { Request } from './Request'

interface Props {
  tagName: string
}

export const PendingRequests = ({ tagName }: Props) => {
  const { getPendingRequests } = useSquad()

  const { data: pendingRequests, refetch: refetchRequests } = useQuery({
    queryKey: ['get-pending-requests', tagName],
    queryFn: () => {
      return getPendingRequests({ tagName })
    },
    select: (data) => {
      return data.data.result.content
    }
  })

  return (
    <ScrollArea.Autosize mah={500}>
      <Stack ml={16} gap={0}>
        {pendingRequests?.map((request) => (
          <Box key={request.id} px={16} py={8}>
            <Request
              tagName={tagName}
              request={request}
              refetch={refetchRequests}
            />
          </Box>
        ))}
      </Stack>
    </ScrollArea.Autosize>
  )
}
