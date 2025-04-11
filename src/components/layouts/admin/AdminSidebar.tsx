import {
  ActionIcon,
  Box,
  Button,
  Group,
  Image,
  Stack,
  Text
} from '@mantine/core'
import { GIcon } from '../../common/GIcon'
import Logo from '../../../public/Logo.png'
import { SidebarPart } from '../SidebarPart'
import { SidebarItem } from '../SidebarItem'

interface Props {
  toggle: () => void
  opened: boolean
}

export const AdminSidebar = ({ toggle, opened }: Props) => {
  return (
    <Box
      pt={12}
      px={opened ? 12 : 4}
      className="flex flex-col justify-between"
      h={'100%'}
      pb={24}
    >
      <Box>
        <Box h={60}>
          <Image
            src={Logo}
            alt="Logo"
            mx={'auto'}
            h={'100%'}
            w={'auto'}
            hidden={!opened}
          />
        </Box>
        <Group justify={opened ? 'space-between' : 'center'}>
          {opened && (
            <Text c="gray" className="!text-[12px] !font-bold">
              DASHBOARD
            </Text>
          )}
          <ActionIcon
            variant="subtle"
            onClick={() => {
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
        <Stack gap={32} pt={8}>
          <SidebarPart opened={opened}>
            <Stack gap={8}>
              <SidebarItem
                icon="Users"
                label="Users"
                href="/admin/users"
                opened={opened}
              />
              <SidebarItem
                icon="BrowserShare"
                label="Posts"
                href="/admin/posts"
                opened={opened}
              />
              <SidebarItem
                icon="ChartCohort"
                label="Squads"
                href="/admin/squads"
                opened={opened}
              />
            </Stack>
          </SidebarPart>
        </Stack>
      </Box>
      <Box>
        <Button
          variant="light"
          leftSection={<GIcon name="Power" size={16} />}
          color="red"
          w={'100%'}
        >
          Sign out
        </Button>
      </Box>
    </Box>
  )
}
