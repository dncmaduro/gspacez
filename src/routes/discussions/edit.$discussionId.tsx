import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Box, Group, Loader, Text, ActionIcon } from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { useDiscussion } from '../../hooks/useDiscussion'
import { useQuery } from '@tanstack/react-query'
import { DiscussionForm } from '../../components/discussions/DiscussionForm'

export const Route = createFileRoute('/discussions/edit/$discussionId')({
  component: RouteComponent
})

function RouteComponent() {
  const { discussionId } = useParams({
    from: '/discussions/edit/$discussionId'
  })
  const router = useRouter()
  const { getDetailDiscussion } = useDiscussion()

  const { data, isLoading } = useQuery({
    queryKey: ['get-discussion', discussionId],
    queryFn: () => getDetailDiscussion(discussionId),
    select: (data) => data.data.result
  })

  return (
    <AppLayout>
      <Box maw={800} mx="auto" px={32} py={20}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Group align="center" mt={20} gap={8}>
              <ActionIcon
                size="md"
                variant="subtle"
                color="gray"
                onClick={() => router.history.back()}
              >
                <GIcon name="ArrowLeft" size={20} />
              </ActionIcon>
              <Text className="text-center !text-2xl !font-bold">
                Edit Discussion
              </Text>
            </Group>
            <Box mt={32}>
              <DiscussionForm discussion={data} />
            </Box>
          </>
        )}
      </Box>
    </AppLayout>
  )
}
