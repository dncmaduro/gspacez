import {
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Image,
  Menu,
  TextInput
} from '@mantine/core'
import Logo from '../../../public/Logo.png'
import { Link } from '@tanstack/react-router'
import { GIcon } from '../../common/GIcon'

export const AppHeader = () => {
  return (
    <Box w="100%" h={56} className="shadow-sm">
      <Flex align="center" px={16} h="100%" justify="space-between">
        <Group gap={16}>
          <Link to="/app">
            <Image src={Logo} h={56} />
          </Link>
        </Group>
        <TextInput
          leftSection={<GIcon name="ZoomCode" size={20} />}
          w={400}
          radius="xl"
          size="md"
          placeholder="Search in GspaceZ"
        />
        <Group gap={16}>
          <Button
            size="md"
            radius="xl"
            leftSection={<GIcon name="Sparkles" size={18} />}
          >
            Create your new post
          </Button>
          <Menu>
            <Menu.Target>
              <Avatar className="cursor-pointer" size="md" />
            </Menu.Target>
            <Menu.Dropdown w={180}>
              <Menu.Item leftSection={<GIcon name="User" size={14} />}>
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<GIcon name="Settings" size={14} />}>
                Settings
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                leftSection={<GIcon name="Power" size={14} />}
                color="red"
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Flex>
    </Box>
  )
}
