import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Group,
  Stack,
  Text,
  TextInput
} from '@mantine/core'
import { SidebarPart } from '../SidebarPart'
import { GIcon } from '../../common/GIcon'
import { SidebarItem } from '../SidebarItem'
import { Link } from '@tanstack/react-router'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { useSquad } from '../../../hooks/useSquad'
import { useQuery } from '@tanstack/react-query'
import { SidebarSquad } from '../SidebarSquad'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  opened: boolean
  toggle: () => void
}

export const AppSidebar = ({ opened, toggle }: Props) => {
  const [openedSearch, { toggle: toggleSearch }] = useDisclosure(false)
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebouncedValue(searchText, 300)[0]

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

  return (
    <Box
      pt={12}
      px={opened ? 12 : 4}
      style={{
        overflowY: 'scroll',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
      <Group justify={opened ? 'space-between' : 'center'}>
        {opened && (
          <Text c="gray" className="!text-[12px] !font-bold">
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
        >
          <GIcon
            name={
              opened
                ? 'LayoutSidebarRightExpandFilled'
                : 'LayoutSidebarLeftExpandFilled'
            }
            size={20}
            color="gray"
          />
        </ActionIcon>
      </Group>
      <Stack gap={32} pt={24}>
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
              <SidebarSquad key={squad.squadId} squad={squad} opened={opened} />
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

        <SidebarPart title="AI" icon="Ai" opened={opened}>
          <SidebarItem icon="Ai" label="AI" href="/ai" opened={opened} />
        </SidebarPart>

        <SidebarPart title="Discover" icon="Compass" opened={opened}>
          <Stack gap={4}>
            <SidebarItem icon="Hash" label="Tags" opened={opened} />
            <SidebarItem icon="Message" label="Discussions" opened={opened} />
          </Stack>
        </SidebarPart>

        <SidebarPart opened={opened}>
          <SidebarItem icon="DevicesStar" label="Feedback" opened={opened} />
        </SidebarPart>
      </Stack>
    </Box>
  )
}
