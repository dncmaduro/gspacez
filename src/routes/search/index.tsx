import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Box,
  Button,
  Flex,
  Group,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { useEffect, useState } from 'react'
import { UsersSearch } from '../../components/search/UsersSearch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PostsSearch } from '../../components/search/PostsSearch'
import { SquadsSearch } from '../../components/search/SquadsSearch'
import { useGSearch } from '../../hooks/useGSearch'
import { useDisclosure } from '@mantine/hooks'

export const Route = createFileRoute('/search/')({
  component: RouteComponent,
  validateSearch: (search) =>
    search as {
      searchText: string
      tab: string
    }
})

function RouteComponent() {
  const params = useSearch({ strict: false })
  const [searchText, setSearchText] = useState<string>(params.searchText)
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false)
  const [useSupport, { toggle: toggleSupport }] = useDisclosure(false)
  const [promptSearch, setPromptSearch] = useState<string>('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { pushSearchHistory } = useGSearch()

  const tabs = [
    {
      label: 'Users',
      value: 'users',
      tab: (
        <UsersSearch
          searchText={searchText}
          triggerSearch={triggerSearch}
          promptSearch={promptSearch}
          useSupport={useSupport}
        />
      )
    },
    {
      label: 'Posts',
      value: 'posts',
      tab: (
        <PostsSearch
          searchText={searchText}
          triggerSearch={triggerSearch}
          promptSearch={promptSearch}
          useSupport={useSupport}
        />
      )
    },
    {
      label: 'Squads',
      value: 'squads',
      tab: (
        <SquadsSearch
          searchText={searchText}
          triggerSearch={triggerSearch}
          promptSearch={promptSearch}
          useSupport={useSupport}
        />
      )
    }
  ]

  const { mutate: push } = useMutation({
    mutationFn: () => pushSearchHistory({ content: searchText })
  })

  useEffect(() => {
    push()
    if (!params.tab) {
      navigate({
        to: `/search?searchText=${params.searchText}&tab=${tabs[0].value}`
      })
    }
  }, [])

  return (
    <AppLayout hideSearchInput>
      <Box maw={1200} mx={'auto'} px={32} py={24} className="animate-fade-in">
        <Stack align="center" mb={32}>
          <TextInput
            leftSection={<GIcon name="ZoomCode" size={20} />}
            w={{ base: '100%', sm: 400, md: 500 }}
            radius="xl"
            styles={{
              root: {
                borderRadius: '30px'
              }
            }}
            size="md"
            className="shadow-sm transition-all duration-200 hover:shadow-md"
            placeholder="Search in GspaceZ"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate({
                  to: `/search?searchText=${searchText}&tab=${params.tab}`
                })
                setTriggerSearch((prev) => !prev)
                queryClient.invalidateQueries({ queryKey: ['search-users'] })
              }
            }}
          />
        </Stack>

        <Flex
          gap={16}
          className="rounded-lg bg-white/80 shadow-sm backdrop-blur-sm"
        >
          <Tabs
            orientation="horizontal"
            variant="pills"
            radius={'xl'}
            defaultValue={params.tab ?? 'users'}
            onChange={(e) =>
              navigate({ to: `/search?searchText=${searchText}&tab=${e}` })
            }
            mx={'auto'}
            className="grow"
            p={16}
          >
            <Tabs.List grow mb={24} justify="center">
              {tabs.map((tab) => (
                <Tabs.Tab
                  value={tab.value}
                  key={tab.value}
                  bg={tab.value === params.tab ? 'indigo' : 'indigo.0'}
                  className="transition-colors duration-200"
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {tabs.map((tab) => (
              <Tabs.Panel value={tab.value} key={tab.value}>
                {tab.tab}
              </Tabs.Panel>
            ))}
          </Tabs>

          <Stack miw={'30%'} p={16}>
            <Flex align={'center'} justify={'space-between'}>
              <Group gap={8} className="!text-indigo-800">
                <GIcon name="Sparkles" />
                <Text fw={500} size="lg">
                  AI Support
                </Text>
              </Group>
              <Switch checked={useSupport} onChange={toggleSupport} />
            </Flex>
            <Textarea
              placeholder="Need help? Ask AI"
              onChange={(e) => setPromptSearch(e.target.value)}
              value={promptSearch}
              minRows={12}
              hidden={!useSupport}
              autosize
              radius="md"
            />
            <Button
              className="self-end"
              variant="gradient"
              hidden={!useSupport}
              gradient={{ from: 'indigo', to: 'violet' }}
              onClick={() => {
                setTriggerSearch((prev) => !prev)
              }}
            >
              Apply
            </Button>
          </Stack>
        </Flex>
      </Box>
    </AppLayout>
  )
}
