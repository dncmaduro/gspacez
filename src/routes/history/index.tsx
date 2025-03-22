import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { usePost } from '../../hooks/usePost'
import { useQuery } from '@tanstack/react-query'
import { Box, Stack } from '@mantine/core'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

export const Route = createFileRoute('/history/')({
  component: RouteComponent
})

function RouteComponent() {
  const { getHistory } = usePost()
  const token = useSelector((state: RootState) => state.auth.token)

  const { data: history, isLoading } = useQuery({
    queryKey: ['get-history'],
    queryFn: () => getHistory({ page: 2, size: 2 }, token)
  })

  return (
    <AppLayout>
      <Box mx="auto" w={1000} mt={32}>
        <Stack gap={16}></Stack>
      </Box>
    </AppLayout>
  )
}
