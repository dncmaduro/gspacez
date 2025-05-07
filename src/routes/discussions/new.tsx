import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Box, Stack, Text } from '@mantine/core'
import { DiscussionForm } from '../../components/discussions/DiscussionForm'

export const Route = createFileRoute('/discussions/new')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <AppLayout>
      <Box maw={1000} w="100%" mx="auto" px={32} py={20}>
        <Stack align="center">
          <Text className="!text-4xl !font-bold">Create a discussion</Text>
          <Text className="!text-lg">
            Create a discussion to share your opinions and know others
          </Text>
        </Stack>
        <DiscussionForm />
      </Box>
    </AppLayout>
  )
}
