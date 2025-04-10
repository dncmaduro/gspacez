import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Box, Divider, Stack, Tabs, TextInput } from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { useEffect, useState } from 'react'
import { UsersSearch } from '../../components/search/UsersSearch'
import { useQueryClient } from '@tanstack/react-query'
import { PostsSearch } from '../../components/search/PostsSearch'

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
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const tabs = [
    {
      label: 'Users',
      value: 'users',
      tab: <UsersSearch searchText={searchText} triggerSearch={triggerSearch} />
    },
    {
      label: 'Posts',
      value: 'posts',
      tab: <PostsSearch searchText={searchText} triggerSearch={triggerSearch} />
    }
  ]

  useEffect(() => {
    if (!params.tab) {
      navigate({
        to: `/search?searchText=${params.searchText}&tab=${tabs[0].value}`
      })
    }
  })

  return (
    <AppLayout hideSearchInput>
      <Box maw={1000} mx={'auto'} px={32}>
        <Stack align="center">
          <TextInput
            leftSection={<GIcon name="ZoomCode" size={20} />}
            w={400}
            radius="xl"
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
      </Box>

      <Tabs
        mt={32}
        orientation="vertical"
        variant="pills"
        radius={'xl'}
        defaultValue={params.tab ?? 'users'}
        onChange={(e) =>
          navigate({ to: `/search?searchText=${searchText}&tab=${e}` })
        }
        maw={1000}
        mx={'auto'}
      >
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab value={tab.value} key={tab.value}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Divider orientation="vertical" mx={16} color="indigo.3" />

        {tabs.map((tab) => (
          <Tabs.Panel value={tab.value} key={tab.value}>
            {tab.tab}
          </Tabs.Panel>
        ))}
      </Tabs>
    </AppLayout>
  )
}
