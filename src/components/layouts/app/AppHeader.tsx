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
import { GToast } from '../../common/GToast'
import { useState } from 'react'
import { useAuthStore } from '../../../store/authStore'
import { useMe } from '../../../hooks/useMe'
import { useCallbackStore } from '../../../store/callbackStore'

interface Props {
  hideSearchInput?: boolean
}

export const AppHeader = ({ hideSearchInput }: Props) => {
  const { location } = useRouterState()
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()
  const { clearCallbackUrl } = useCallbackStore()
  const [searchText, setSearchText] = useState<string>('')
  const { data: profileData } = useMe()

  const signOut = () => {
    clearAuth()
    clearCallbackUrl()
    navigate({ to: '/' })
    GToast.success({
      title: 'Sign out successfully!'
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
        {!hideSearchInput && (
          <TextInput
            leftSection={<GIcon name="ZoomCode" size={20} />}
            w={400}
            radius="xl"
            placeholder="Search in GspaceZ"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            onKeyDownCapture={(e) => {
              if (e.key === 'Enter') {
                navigate({ to: `/search?searchText=${searchText}` })
              }
            }}
          />
        )}
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
              <Avatar src={profileData?.avatarUrl} className="cursor-pointer" size="md" />
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
