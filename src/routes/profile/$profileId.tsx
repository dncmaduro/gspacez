import { createFileRoute, useParams } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Avatar,
  Box,
  Flex,
  Group,
  Loader,
  Stack,
  Tabs,
  Text
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useProfile } from '../../hooks/useProfile'
import { GIcon } from '../../components/common/GIcon'

export const Route = createFileRoute('/profile/$profileId')({
  component: RouteComponent
})

function RouteComponent() {
  const { getProfile } = useProfile()
  const { profileId } = useParams({ from: `/profile/$profileId` })

  const { data, isLoading } = useQuery({
    queryKey: ['get-profile'],
    queryFn: () => {
      return getProfile(profileId)
    }
  })

  const profileData = data?.data.result

  const tabs = [
    {
      label: 'Posts',
      value: 'posts',
      item: <></>
    },
    {
      label: 'Upvoted',
      value: 'upvoted',
      item: <></>
    }
  ]

  return (
    <AppLayout>
      <Box maw={1000} mx="auto" px={12}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Flex h="100%" gap={8} mih={1000}>
              <Stack w="30%" gap={4}>
                <Box
                  className="rounded-lg border border-indigo-200 hover:bg-indigo-50"
                  p={16}
                >
                  <Stack gap={16}>
                    <Group>
                      <Avatar src={profileData?.avatarUrl} size="lg" />
                      <Text size="xl" className="!font-bold">
                        {profileData?.firstName} {profileData?.lastName}
                      </Text>
                    </Group>
                    <Group>
                      <GIcon name="Calendar" size={24} />
                      <Text>{profileData?.dob}</Text>
                    </Group>
                  </Stack>
                </Box>
                <Box
                  className="rounded-lg border border-indigo-200 hover:bg-indigo-50"
                  p={16}
                >
                  <Text size="lg">Involved Squads</Text>
                </Box>
                <Box
                  className="rounded-lg border border-indigo-200 hover:bg-indigo-50"
                  p={16}
                >
                  <Text size="lg">View other social accounts</Text>
                </Box>
              </Stack>
              <Box className="grow rounded-lg border border-indigo-200">
                <Tabs defaultValue={tabs[0].value}>
                  <Tabs.List h={44}>
                    {tabs.map((tab) => (
                      <Tabs.Tab key={tab.value} value={tab.value}>
                        <span className="font-bold">{tab.label}</span>
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                </Tabs>
              </Box>
            </Flex>
          </>
        )}
      </Box>
    </AppLayout>
  )
}
