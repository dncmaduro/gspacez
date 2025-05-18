import { createFileRoute, Link } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { useDark } from '../../hooks/useDark'
import { useProfile } from '../../hooks/useProfile'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMe } from '../../hooks/useMe'
import { useState } from 'react'
import { useSquad } from '../../hooks/useSquad'
import { GToast } from '../../components/common/GToast'

export const Route = createFileRoute('/settings/')({
  component: RouteComponent
})

function RouteComponent() {
  const { isDark, toggleTheme } = useDark()
  const { getJoinedSquads } = useProfile()
  const { data: meData } = useMe()
  const [searchText, setSearchText] = useState<string>('')
  const { leaveSquad } = useSquad()

  const { data: joinedSquads, refetch: refetchSquads } = useQuery({
    queryKey: ['get-joined-squads'],
    queryFn: () => getJoinedSquads(meData?.profileTag || ''),
    select: (data) => {
      return data.data.result
    }
  })

  const { mutate: leave } = useMutation({
    mutationKey: ['leave-squad'],
    mutationFn: (tagName: string) => {
      return leaveSquad({ tagName })
    },
    onSuccess: () => {
      GToast.success({
        title: 'Leave squad successfully!'
      })
    },
    onError: () => {
      GToast.error({
        title: 'Leave squad failed'
      })
    },
    onSettled: () => {
      refetchSquads()
    }
  })

  const tabs = {
    display: {
      label: 'Display',
      value: 'display',
      panel: (
        <Switch
          checked={isDark}
          onClick={toggleTheme}
          size="md"
          onLabel={
            <GIcon name="SunFilled" stroke={1.5} size={18} color="yellow" />
          }
          label={isDark ? 'Dark mode' : 'Light mode'}
          offLabel={
            <GIcon name="MoonFilled" stroke={1.5} size={18} color="purple" />
          }
        />
      )
    },
    feed: {
      label: 'Feed',
      value: 'feed',
      panel: <Text>Go to the feed page to customize your feed</Text>
    },
    squad: {
      label: 'Squad',
      value: 'squad',
      panel: (
        <Box className="grow">
          <Text>All squads you have joined</Text>
          <TextInput
            placeholder="Search squads"
            value={searchText}
            mt={24}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <ScrollArea.Autosize mt={24}>
            <Stack>
              {joinedSquads
                ?.filter(
                  (s) =>
                    s.name.includes(searchText) ||
                    s.tagName.includes(searchText)
                )
                .map((squad) => (
                  <Box
                    key={squad.tagName}
                    p={16}
                    bg="gray.0"
                    className="rounded-lg"
                  >
                    <Flex justify={'space-between'}>
                      <Group>
                        <Avatar src={squad.avatarUrl} />
                        <Stack gap={0}>
                          <Text fw={500}>{squad.name}</Text>
                          <Text size="sm" c="dimmed">
                            @{squad.tagName}
                          </Text>
                        </Stack>
                      </Group>

                      <Group>
                        <Button
                          variant="outline"
                          size="xs"
                          component={Link}
                          to={`/squad/${squad.tagName}`}
                          leftSection={<GIcon name="ArrowRight" size={16} />}
                        >
                          Go to squad
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          color="red"
                          leftSection={<GIcon name="X" size={16} />}
                          onClick={() => leave(squad.tagName)}
                        >
                          Leave
                        </Button>
                      </Group>
                    </Flex>
                  </Box>
                ))}
            </Stack>
          </ScrollArea.Autosize>
        </Box>
      )
    }
  }

  return (
    <AppLayout>
      <Paper maw={1000} w="100%" mx="auto" px={32} py={20}>
        <Text fw={500} size="xl">
          Settings
        </Text>
        <Divider my={16} />
        <Tabs orientation="vertical" variant="pills" defaultValue={'display'}>
          <Tabs.List>
            {Object.values(tabs).map((tab) => (
              <Tabs.Tab value={tab.value} key={tab.value}>
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {Object.values(tabs).map((tab) => (
            <Tabs.Panel value={tab.value} key={tab.value}>
              <Flex h={'max-content'} mih={'100% '}>
                <Divider orientation="vertical" mx={16} />
                {tab.panel}
              </Flex>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Paper>
    </AppLayout>
  )
}
