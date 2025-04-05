import { createFileRoute, useParams } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Box, Loader, Stack, Text } from '@mantine/core'
import { SquadForm } from '../../components/squad/SquadForm'
import { useQuery } from '@tanstack/react-query'
import { useSquad } from '../../hooks/useSquad'

export const Route = createFileRoute('/squad/edit/$tagName')({
  component: RouteComponent
})

function RouteComponent() {
  const { tagName } = useParams({ from: '/squad/edit/$tagName' })
  const { getSquad } = useSquad()

  const { data, isLoading } = useQuery({
    queryKey: ['get-squad'],
    queryFn: () => {
      return getSquad(tagName)
    },
    select: (data) => {
      return data.data.result
    }
  })

  return (
    <AppLayout>
      <Box maw={1000} mx="auto" px={32} py={20}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Stack align="center">
              <Text className="!text-2xl" mb={16}>
                Update your squad{' '}
                <span className="font-bold">{data?.name}</span>
              </Text>
            </Stack>
            <SquadForm squad={data} />
          </>
        )}
      </Box>
    </AppLayout>
  )
}
