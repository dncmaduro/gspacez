import {
  ActionIcon,
  Autocomplete,
  AutocompleteProps,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Image,
  Indicator,
  Menu,
  Popover,
  Stack,
  Text,
  Tooltip
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
import { HeaderNotifications } from '../HeaderNotifications'
import { useProfile } from '../../../hooks/useProfile'
import { useNotificationStore } from '../../../store/notificationStore'

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
  const { data: meData } = useMe()
  const { signOut } = useAuth()
  const { getStreak, getNotifications } = useProfile()
  const { notificationsQuantity } = useNotificationStore()

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

  const { data: streakData } = useQuery({
    queryKey: ['get-streak', meData?.id || ''],
    queryFn: () => getStreak(meData?.id || ''),
    select: (data) => {
      return data.data.result.currentStreak
    },
    enabled: !!meData?.id
  })

  const { data: notificationsData, isLoading: isNotificationLoading } =
    useQuery({
      queryKey: ['get-notifications', meData?.id || ''],
      queryFn: () => getNotifications(meData?.id || ''),
      select: (data) => {
        return {
          notifications: data.data.result || [],
          quantity: data.data.size
        }
      }
    })

  return (
    <Box w="100%" h="100%" className="bg-white shadow-md">
      <Flex align="center" px={24} h="100%" justify="space-between">
        <Group gap={20}>
          <Link to="/app" className="transition-transform hover:scale-105">
            <Image src={Logo} h={48} />
          </Link>
        </Group>
        {!hideSearchInput && (
          <Autocomplete
            leftSection={<GIcon name="ZoomCode" size={20} color="#4F46E5" />}
            w={450}
            radius="xl"
            placeholder="Search in GspaceZ"
            onChange={(e) => setSearchText(e)}
            value={searchText}
            className="rounded-full transition-shadow duration-200 focus-within:border-indigo-200/50 hover:shadow-sm"
            styles={{
              input: {
                border: '1px solid #E5E7EB',
                height: '42px'
              }
            }}
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
        <Group gap={20}>
          {location.pathname !== '/post/new' && (
            <Button
              component={Link}
              to="/post/new"
              radius="xl"
              variant="filled"
              className="bg-indigo-600 transition-colors duration-200 hover:bg-indigo-700"
              leftSection={<GIcon name="Sparkles" size={18} />}
              px={20}
            >
              Create my new post
            </Button>
          )}
          <Popover withArrow>
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                size={'xl'}
                p={4}
                className="overflow-visible"
                radius={'xl'}
              >
                {notificationsQuantity !== notificationsData?.quantity ? (
                  <Indicator
                    label={
                      notificationsData
                        ? notificationsData.quantity - notificationsQuantity
                        : undefined
                    }
                    color="red"
                    offset={8}
                    inline
                    size={notificationsQuantity ? 16 : 12}
                  >
                    <GIcon name="Bell" size={28} />
                  </Indicator>
                ) : (
                  <GIcon name="Bell" size={28} />
                )}
              </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
              <HeaderNotifications
                size={notificationsData?.quantity || 0}
                notifications={notificationsData?.notifications || []}
                isLoading={isNotificationLoading}
              />
            </Popover.Dropdown>
          </Popover>
          <Box className="rounded-full bg-orange-200/50" px={16} py={8}>
            <Tooltip
              withArrow
              color="orange"
              openDelay={300}
              label={`You have ${streakData} days of streak`}
            >
              <Group gap={4}>
                <GIcon name="FlameFilled" size={20} color="#f66427" />
                <Text c={'orange'} className="!font-bold">
                  {streakData}
                </Text>
              </Group>
            </Tooltip>
          </Box>
          <Menu position="bottom-end" shadow="md" width={200}>
            <Menu.Target>
              <Avatar
                src={meData?.avatarUrl}
                className="cursor-pointer border-2 border-indigo-100 transition-colors duration-200 hover:border-indigo-300"
                size="md"
                radius="xl"
              />
            </Menu.Target>
            <Menu.Dropdown className="rounded-lg p-1 shadow-lg">
              <Menu.Item
                component={Link}
                to="/me"
                leftSection={<GIcon name="User" size={16} />}
                className="rounded-md py-2 hover:bg-indigo-50"
              >
                Profile
              </Menu.Item>
              <Menu.Item
                leftSection={<GIcon name="Settings" size={16} />}
                className="rounded-md py-2 hover:bg-indigo-50"
              >
                Settings
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                leftSection={<GIcon name="Power" size={16} />}
                color="red"
                onClick={() => onSignOut()}
                className="rounded-md py-2 hover:bg-red-50"
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
