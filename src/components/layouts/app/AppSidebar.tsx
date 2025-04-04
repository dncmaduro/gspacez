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
import { SidebarPart } from './SidebarPart'
import { GIcon } from '../../common/GIcon'
import { SidebarItem } from './SidebarItem'
import { Link } from '@tanstack/react-router'
import { useDisclosure } from '@mantine/hooks'
import { useSquad } from '../../../hooks/useSquad'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { SidebarSquad } from './SidebarSquad'

interface Props {
  opened: boolean
  toggle: () => void
}

export const AppSidebar = ({ opened, toggle }: Props) => {
  const [openedSearch, { toggle: toggleSearch }] = useDisclosure(false)
  const token = useSelector((state: RootState) => state.auth.token)

  const { getLastAccessSquads } = useSquad()

  const { data: lastAccessSquads } = useQuery({
    queryKey: ['getLastAccessSquads'],
    queryFn: () => getLastAccessSquads(token),
    select: (data) => {
      return data.data.result
    }
  })

  return (
    <Box pt={12} px={opened ? 12 : 4}>
      <Group justify={opened ? 'space-between' : 'center'}>
        {opened && (
          <Text c="gray" className="!text-[12px] !font-bold">
            MENU
          </Text>
        )}
        <ActionIcon variant="subtle" onClick={toggle}>
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
            <SidebarItem icon="News" label="My feed" href="/app" />
            <SidebarItem icon="Flame" label="Explore" />
            <SidebarItem icon="History" label="History" href="/history" />
          </Stack>
        </SidebarPart>

        <SidebarPart title="Network" icon="World" opened={opened}>
          <Stack gap={4} w="100%" align="center">
            <SidebarItem
              icon="ChartCohort"
              label="Search squads"
              onClick={toggleSearch}
            />
            <Collapse in={openedSearch} w={'100%'}>
              <TextInput
                leftSection={<GIcon name="Search" size={16} />}
                radius={'md'}
                size="xs"
              />
            </Collapse>
            <Divider my={2} w="100%" />
            {lastAccessSquads?.map((squad) => (
              <SidebarSquad squad={squad} key={squad.squadId} />
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

        <SidebarPart title="AI" icon="AI" opened={opened}>
          <SidebarItem icon="Ai" label="AI" href="/ai" />
        </SidebarPart>

        <SidebarPart title="Discover" icon="Compass" opened={opened}>
          <Stack gap={4}>
            <SidebarItem icon="Hash" label="Tags" />
            <SidebarItem icon="Message" label="Discussions" />
          </Stack>
        </SidebarPart>

        <SidebarPart opened={opened}>
          <SidebarItem icon="DevicesStar" label="Feedback" />
        </SidebarPart>
      </Stack>
    </Box>
  )
}
