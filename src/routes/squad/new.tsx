import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Box, Stack, Text } from '@mantine/core'
import { SquadForm } from '../../components/squad/SquadForm'

export const Route = createFileRoute('/squad/new')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <AppLayout>
      <Box maw={1000} mx="auto" px={32} py={20}>
        <Stack align="center">
          <Text className="!text-4xl !font-bold">Create squad</Text>
          <Text className="!text-lg">
            Create a place that people can interact with others about a topic
          </Text>
        </Stack>
        <SquadForm />
      </Box>
    </AppLayout>
  )
}
