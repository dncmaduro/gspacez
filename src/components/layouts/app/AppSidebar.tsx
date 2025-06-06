import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
  TextInput
} from '@mantine/core'
import { SidebarPart } from '../SidebarPart'
import { GIcon } from '../../common/GIcon'
import { SidebarItem } from '../SidebarItem'
import { Link, useNavigate } from '@tanstack/react-router'
import { useDebouncedValue, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useSquad } from '../../../hooks/useSquad'
import { useQuery } from '@tanstack/react-query'
import { SidebarSquad } from '../SidebarSquad'
import { useEffect, useMemo, useState } from 'react'
import { useSidebarStore } from '../../../store/sidebarStore'

interface Props {
  opened: boolean
  toggle: () => void
}

export const AppSidebar = ({ opened, toggle }: Props) => {
  const [openedSearch, { toggle: toggleSearch }] = useDisclosure(false)
  const [searchText, setSearchText] = useState('')
  const [searchTextAll, setSearchTextAll] = useState('')
  const debouncedSearchText = useDebouncedValue(searchText, 300)[0]
  const navigate = useNavigate()

  const { getLastAccessSquads } = useSquad()

  const { data: lastAccessSquads } = useQuery({
    queryKey: ['get-last-access-squads'],
    queryFn: () => getLastAccessSquads(),
    select: (data) => {
      return data.data.result
    }
  })

  useEffect(() => {
    if (!openedSearch) {
      setSearchText('')
    }
  }, [openedSearch])

  const convertSquads = useMemo(() => {
    return lastAccessSquads?.filter((squad) =>
      squad.name.toLowerCase().includes(debouncedSearchText.toLowerCase())
    )
  }, [debouncedSearchText, lastAccessSquads])

  const handleOpenSearch = () => {
    toggleSearch()
    if (!opened) {
      toggle()
    }
  }

  const isMobile = useMediaQuery('(max-width: 768px)')
  const { opened: openedSidebar, toggle: toggleSidebar } = useSidebarStore()

  const Sidebar = () => {
    return (
      <Box
        pt={12}
        px={opened ? 12 : 4}
        style={{
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          transition: 'all 300ms ease-in-out',
          width: opened ? 250 : 40
        }}
        className="no-scrollbar"
      >
        {isMobile && (
          <TextInput
            size="md"
            radius={'xl'}
            leftSection={<GIcon name="ZoomCode" size={18} color="#4F46E5" />}
            placeholder="Search in GspaceZ"
            value={searchTextAll}
            onChange={(e) => setSearchTextAll(e.target.value)}
            className="rounded-full transition-shadow duration-200 focus-within:border-indigo-200/50 hover:shadow-sm"
            onKeyDownCapture={(e) => {
              if (e.key === 'Enter') {
                navigate({ to: `/search?searchText=${searchTextAll}` })
              }
            }}
          />
        )}
        <Group
          mt={isMobile ? 16 : 0}
          justify={opened ? 'space-between' : 'center'}
          className="transition-all duration-300 ease-in-out"
        >
          {opened && (
            <Text
              c="gray"
              className="!text-[12px] !font-bold transition-opacity duration-300"
            >
              MENU
            </Text>
          )}
          <ActionIcon
            variant="subtle"
            onClick={() => {
              if (openedSearch) {
                setSearchText('')
                toggleSearch()
              }
              toggle()
            }}
            className="transition-transform duration-300 ease-in-out"
          >
            {!isMobile && (
              <GIcon
                name={
                  opened
                    ? 'LayoutSidebarRightExpandFilled'
                    : 'LayoutSidebarLeftExpandFilled'
                }
                size={20}
                color="gray"
                className="transition-transform duration-300 ease-in-out"
              />
            )}
          </ActionIcon>
        </Group>
        <Stack
          gap={32}
          pt={24}
          className="transition-all duration-300 ease-in-out"
        >
          <SidebarPart opened={opened}>
            <Stack gap={4}>
              <SidebarItem
                icon="News"
                label="My feed"
                href="/app"
                opened={opened}
              />
              <SidebarItem
                icon="Flame"
                href="/explore"
                label="Explore"
                opened={opened}
              />
              <SidebarItem
                icon="History"
                label="History"
                href="/history"
                opened={opened}
              />
            </Stack>
          </SidebarPart>

          <SidebarPart title="Network" icon="World" opened={opened}>
            <Stack gap={4} w="100%" align="center">
              <SidebarItem
                icon="ChartCohort"
                label="Search squads"
                onClick={() => handleOpenSearch()}
                opened={opened}
              />
              <Collapse in={openedSearch} w={'100%'}>
                <TextInput
                  leftSection={<GIcon name="Search" size={16} />}
                  radius={'md'}
                  size="xs"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Collapse>
              <Divider my={2} w="100%" />
              {convertSquads?.map((squad) => (
                <SidebarSquad
                  key={squad.squadId}
                  squad={squad}
                  opened={opened}
                />
              ))}
              {opened ? (
                <Button
                  size="xs"
                  leftSection={<GIcon name="Plus" size={16} />}
                  color="indigo.6"
                  variant="subtle"
                  component={Link}
                  to="/squad/new"
                >
                  Create squad
                </Button>
              ) : (
                <ActionIcon color="indigo.6" variant="subtle">
                  <GIcon name="Plus" size={16} />
                </ActionIcon>
              )}
            </Stack>
          </SidebarPart>

          <SidebarPart title="AI Chat" icon="Sparkles" opened={opened}>
            <SidebarItem
              icon="Sparkles"
              label="AI Chat"
              href="/ai"
              opened={opened}
            />
          </SidebarPart>

          <SidebarPart title="Discover" icon="Compass" opened={opened}>
            <Stack gap={4}>
              <SidebarItem
                icon="Hash"
                label="Tags"
                href="/tags"
                opened={opened}
              />
              <SidebarItem
                icon="Message"
                label="Discussions"
                opened={opened}
                href="/discussions"
              />
            </Stack>
          </SidebarPart>

          <SidebarPart opened={opened}>
            <SidebarItem
              icon="DevicesStar"
              label="Feedback"
              opened={opened}
              href="/feedback"
            />
          </SidebarPart>
        </Stack>
      </Box>
    )
  }

  if (isMobile) {
    return (
      <Drawer
        opened={openedSidebar}
        size="80%"
        position="left"
        onClose={toggleSidebar}
        transitionProps={{
          duration: 150,
          timingFunction: 'linear'
        }}
      >
        <Sidebar />
      </Drawer>
    )
  }

  return <Sidebar />
}
