import {
  Autocomplete,
  AutocompleteProps,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Image,
  Menu,
  Stack,
  Text
} from '@mantine/core'
import Logo from '../../../public/Logo.png'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { GIcon } from '../../common/GIcon'
import { GToast } from '../../common/GToast'
import { useMemo, useState } from 'react'
import { useAuthStore } from '../../../store/authStore'
import { useMe } from '../../../hooks/useMe'
import { useCallbackStore } from '../../../store/callbackStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import { useGSearch } from '../../../hooks/useGSearch'

interface Props {
  hideSearchInput?: boolean
}

interface AutocompleteItem {
  type: 'user' | 'post' | 'squad'
  label: string
  value: string
  description: string
  image: string
}

export const AppHeader = ({ hideSearchInput }: Props) => {
  const { location } = useRouterState()
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()
  const { clearCallbackUrl } = useCallbackStore()
  const [searchText, setSearchText] = useState<string>('')
  const { data: profileData } = useMe()
  const { signOut } = useAuth()

  const { mutate: onSignOut } = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: () => signOut(),
    onSuccess: () => {
      clearAuth()
      clearCallbackUrl()
      navigate({ to: '/' })
      GToast.success({
        title: 'Sign out successfully!'
      })
    },
    onError: () => {
      clearAuth()
      clearCallbackUrl()
      navigate({ to: '/' })
      GToast.error({
        title: 'Sign out failed!',
        subtitle:
          'Something happen! You should check other devices that you logged in'
      })
    }
  })

  const { searchPosts, searchSquads, searchUsers } = useGSearch()

  const { data: usersData } = useQuery({
    queryKey: ['search-users', searchText],
    queryFn: () => searchUsers({ searchText, size: 2, page: 0 }),
    select: (data) => {
      return data.data.result.content
    },
    enabled: !!searchText
  })

  const { data: squadsData } = useQuery({
    queryKey: ['search-squads', searchText],
    queryFn: () => searchSquads({ searchText, size: 2, page: 0 }),
    select: (data) => {
      return data.data.result.content
    },
    enabled: !!searchText
  })

  const { data: postsData } = useQuery({
    queryKey: ['search-posts', searchText],
    queryFn: () => searchPosts({ searchText, size: 2, page: 0 }),
    select: (data) => {
      return data.data.result.content
    },
    enabled: !!searchText
  })

  const data = useMemo(() => {
    if (!usersData || !postsData || !squadsData)
      return { data: [], byValues: {} }

    const convertedUsers = (usersData || []).map((user) => ({
      type: 'user',
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
      description: user.email,
      image: user.avatarUrl
    })) as AutocompleteItem[]

    const convertedPosts = (postsData || []).map((post) => ({
      type: 'post',
      label: post.title,
      value: post.id,
      description: `By ${post.profileName}`,
      image: post.avatarUrl
    })) as AutocompleteItem[]

    const convertedSquads = (squadsData || []).map((squad) => ({
      type: 'squad',
      label: squad.name,
      value: squad.tagName,
      description: squad.tagName,
      image: squad.avatarUrl
    })) as AutocompleteItem[]

    return {
      data: [
        { group: 'Posts', items: convertedPosts.map((post) => post.value) },
        { group: 'Squads', items: convertedSquads.map((squad) => squad.value) },
        { group: 'Users', items: convertedUsers.map((user) => user.value) }
      ],
      byValues: [
        ...convertedPosts,
        ...convertedSquads,
        ...convertedUsers
      ].reduce(
        (acc, item) => {
          return { ...acc, [item.value]: item }
        },
        {} as Record<string, AutocompleteItem>
      )
    }
  }, [usersData, postsData, squadsData])

  const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({
    option
  }) => (
    <Group gap={8}>
      <Avatar src={data.byValues[option.value].image} size={36} radius="xl" />
      <Stack gap={0}>
        <Text size="sm">{data.byValues[option.value].label}</Text>
        <Text size="xs" c="dimmed">
          {data.byValues[option.value].description}
        </Text>
      </Stack>
    </Group>
  )

  return (
    <Box w="100%" h="100%" className="shadow-md">
      <Flex align="center" px={16} h="100%" justify="space-between">
        <Group gap={16}>
          <Link to="/app">
            <Image src={Logo} h={56} />
          </Link>
        </Group>
        {!hideSearchInput && (
          <Autocomplete
            leftSection={<GIcon name="ZoomCode" size={20} />}
            w={400}
            radius="xl"
            placeholder="Search in GspaceZ"
            onChange={(e) => setSearchText(e)}
            value={searchText}
            onKeyDownCapture={(e) => {
              if (e.key === 'Enter') {
                navigate({ to: `/search?searchText=${searchText}` })
              }
            }}
            data={data.data}
            renderOption={renderAutocompleteOption}
            onOptionSubmit={(value) => {
              const item = data.byValues[value]
              if (item) {
                if (item.type === 'post') {
                  navigate({ to: `/post/${value}` })
                } else if (item.type === 'squad') {
                  navigate({ to: `/squad/${value}` })
                } else {
                  navigate({ to: `/profile/${value}` })
                }
              }
              return false
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
              <Avatar
                src={profileData?.avatarUrl}
                className="cursor-pointer"
                size="md"
              />
            </Menu.Target>
            <Menu.Dropdown w={180} className="shadow-md">
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
                onClick={() => onSignOut()}
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
