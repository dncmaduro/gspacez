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
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { GIcon } from '../../common/GIcon'
import { useAppDispatch } from '../../../store/store'
import { logout } from '../../../store/authSlice'
import { GToast } from '../../common/GToast'

export const AppHeader = () => {
  const { location } = useRouterState()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const signOut = () => {
    dispatch(logout())
    navigate({ to: '/' })
    GToast.success({
      title: 'Sign ou successfully!'
    })
  }

  return (
    <Box w="100%" h="100%" className="shadow-sm">
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
          placeholder="Search in GspaceZ"
        />
        <Group gap={16}>
          {location.pathname !== '/post/new' && (
            <Button
              component={Link}
              to="/post/new"
              radius="xl"
              variant="light"
              leftSection={<GIcon name="Sparkles" size={18} />}
            >
              Create my new post
            </Button>
          )}
          <Menu>
            <Menu.Target>
              <Avatar className="cursor-pointer" size="md" />
            </Menu.Target>
            <Menu.Dropdown w={180}>
              <Menu.Item
                component={Link}
                to="/me"
                leftSection={<GIcon name="User" size={14} />}
              >
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<GIcon name="Settings" size={14} />}>
                Settings
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                leftSection={<GIcon name="Power" size={14} />}
                color="red"
                onClick={() => signOut()}
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
