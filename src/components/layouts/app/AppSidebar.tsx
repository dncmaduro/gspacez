import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Stack,
  Text
} from '@mantine/core'
import { SidebarPart } from './SidebarPart'
import { GIcon } from '../../common/GIcon'
import { SidebarItem } from './SidebarItem'

interface Props {
  opened: boolean
  toggle: () => void
}

export const AppSidebar = ({ opened, toggle }: Props) => {
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
            <SidebarItem icon="History" label="History" />
          </Stack>
        </SidebarPart>

        <SidebarPart title="Network" icon="World" opened={opened}>
          <Stack gap={4} w="100%" align="center">
            <SidebarItem icon="ChartCohort" label="Search squads" />
            <Divider my={2} w="100%" />
            <SidebarItem icon="Html" label="Web Development" />
            <SidebarItem icon="DeviceMobile" label="Mobile Development" />
            <SidebarItem icon="Ai" label="AI" />
            <SidebarItem icon="Database" label="Database" />
            <SidebarItem icon="Cloud" label="Cloud" />
            {opened ? (
              <Button
                size="xs"
                leftSection={<GIcon name="Plus" size={16} />}
                color="indigo.6"
                variant="subtle"
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
