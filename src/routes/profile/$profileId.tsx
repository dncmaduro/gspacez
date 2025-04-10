import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Avatar,
  Box,
  Flex,
  Group,
  Loader,
  Stack,
  Tabs,
  Text,
  Tooltip
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useProfile } from '../../hooks/useProfile'
import { GIcon } from '../../components/common/GIcon'

export const Route = createFileRoute('/profile/$profileId')({
  component: RouteComponent
})

function RouteComponent() {
  const { getProfile, getJoinedSquads } = useProfile()
  const { profileId } = useParams({ from: `/profile/$profileId` })

  const { data, isLoading } = useQuery({
    queryKey: ['get-profile'],
    queryFn: () => {
      return getProfile(profileId)
    }
  })

  const profileData = data?.data.result

  const { data: squadsData } = useQuery({
    queryKey: ['get-joined-squads', profileId],
    queryFn: () => getJoinedSquads(profileId)
  })

  const joinedSquads = squadsData?.data.result || []

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
                <Box className="rounded-lg border border-indigo-200" p={16}>
                  <Stack gap={16}>
                    <Group gap={8}>
                      <Avatar src={profileData?.avatarUrl} size="md" />
                      <Text className="!text-[17px] !font-bold">
                        {profileData?.firstName} {profileData?.lastName}
                      </Text>
                    </Group>
                    <Group gap={8}>
                      <GIcon name="Calendar" size={16} />
                      <Text size="sm">{profileData?.dob}</Text>
                    </Group>
                  </Stack>
                </Box>
                <Box className="rounded-lg border border-indigo-200" p={16}>
                  <Text size="md">Involved Squads</Text>
                  {!joinedSquads || joinedSquads.length === 0 ? (
                    <Text c="dimmed" size="sm">
                      You haven't joined any squads yet. Join one to start your
                      journey!
                    </Text>
                  ) : (
                    <Group pt={10}>
                      <Tooltip.Group openDelay={300} closeDelay={100}>
                        <Box
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 16
                          }}
                        >
                          {joinedSquads.map((squad) => (
                            <Tooltip label={squad.name} withArrow>
                              <Link to={`/squad/${squad.tagName}`}>
                                <Avatar
                                  src={squad.avatarUrl}
                                  radius="xl"
                                  size="md"
                                  style={{
                                    cursor: 'pointer',
                                    border: '2px solid #ccc'
                                  }}
                                />
                              </Link>
                            </Tooltip>
                          ))}
                        </Box>
                      </Tooltip.Group>
                    </Group>
                  )}
                </Box>
                <Box className="rounded-lg border border-indigo-200" p={16}>
                  <Text size="md">View other social accounts</Text>
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
