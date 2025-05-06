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
import { useNotification } from '../../../hooks/useNotification'
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks'
import { useSidebarStore } from '../../../store/sidebarStore'

interface Props {
  hideSearchInput?: boolean
}

interface AutocompleteItem {
  type: 'user' | 'post' | 'squad' | 'history'
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
  const deboucedSearchText = useDebouncedValue(searchText, 300)[0]
  const { data: meData } = useMe()
  const { signOut } = useAuth()
  const { getStreak } = useProfile()
  const { getNotifications } = useNotification()
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

  const { searchPosts, searchSquads, searchProfiles, getSearchHistory } =
    useGSearch()

  const { data: searchHistory } = useQuery({
    queryKey: ['get-search-history'],
    queryFn: () => getSearchHistory(),
    select: (data) => {
      return data.data.result.map((item) => item.content)
    }
  })

  const { data: usersData } = useQuery({
    queryKey: ['search-users', deboucedSearchText],
    queryFn: () => searchProfiles({ searchText, size: 2, page: 0 }),
    select: (data) => {
      return data.data.result.content
    },
    enabled: !!searchText
  })

  const { data: squadsData } = useQuery({
    queryKey: ['search-squads', deboucedSearchText],
    queryFn: () => searchSquads({ searchText, size: 2, page: 0 }),
    select: (data) => {
      return data.data.result.content
    },
    enabled: !!searchText
  })

  const { data: postsData } = useQuery({
    queryKey: ['search-posts', deboucedSearchText],
    queryFn: () => searchPosts({ searchText, size: 2, page: 0 }),
    select: (data) => {
      return data.data.result.content
    },
    enabled: !!searchText
  })

  const data = useMemo(() => {
    if (!searchText) {
      const convertedHistory =
        ((searchHistory || []).map((item) => ({
          type: 'history',
          label: item,
          value: item,
          description: `History: ${item}`,
          image: ''
        })) as AutocompleteItem[]) || ([] as AutocompleteItem[])

      return {
        data: [
          {
            group: 'Search history',
            items: convertedHistory
          }
        ],
        byValues: convertedHistory.reduce(
          (acc, item) => {
            return { ...acc, [item.value]: item }
          },
          {} as Record<string, AutocompleteItem>
        )
      }
    }

    if (!usersData || !postsData || !squadsData)
      return { data: [], byValues: {} }

    const convertedUsers = (usersData || []).map((user) => ({
      type: 'user',
      label: `${user.firstName} ${user.lastName}`,
      value: user.profileTag,
      description: `@${user.profileTag}`,
      image: user.avatarUrl
    })) as AutocompleteItem[]

    const convertedPosts = (postsData || []).map((post) => ({
      type: 'post',
      label: post.title,
      value: post.id,
      description: `By ${post.profileName} (@${post.profileTag})`,
      image: post.avatarUrl
    })) as AutocompleteItem[]

    const convertedSquads = (squadsData || []).map((squad) => ({
      type: 'squad',
      label: squad.name,
      value: squad.tagName,
      description: `@${squad.tagName}`,
      image: squad.avatarUrl
    })) as AutocompleteItem[]

    return {
      data: [
        {
          group: 'Posts',
          items: convertedPosts
            .filter((post) => !!post.value)
            .map((post) => ({
              value: post.value,
              label: post.label
            }))
        },
        {
          group: 'Squads',
          items: convertedSquads
            .filter((squad) => !!squad.value)
            .map((squad) => ({
              value: squad.value,
              label: squad.label
            }))
        },
        {
          group: 'Users',
          items: convertedUsers
            .filter((user) => !!user.value)
            .map((user) => ({
              value: user.value,
              label: user.label
            }))
        }
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
  }, [usersData, postsData, squadsData, searchHistory, searchText])

  const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({
    option
  }) => (
    <Flex gap={8}>
      <Avatar src={data.byValues[option.value].image} size={36} radius="xl" />
      <Stack gap={0}>
        <Text size="sm">{data.byValues[option.value].label}</Text>
        <Text size="xs" c="dimmed">
          {data.byValues[option.value].description}
        </Text>
      </Stack>
    </Flex>
  )

  const { data: streakData } = useQuery({
    queryKey: ['get-streak', meData?.profileTag || ''],
    queryFn: () => getStreak(meData?.profileTag || ''),
    select: (data) => {
      return data.data.result.currentStreak
    },
    enabled: !!meData?.profileTag
  })

  const { data: notificationsData, isLoading: isNotificationLoading } =
    useQuery({
      queryKey: ['get-notifications', meData?.profileTag || ''],
      queryFn: () => getNotifications(meData?.profileTag || ''),
      select: (data) => {
        return {
          notifications: data.data.result || [],
          quantity: data.data.size
        }
      }
    })

  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  const { toggle: toggleSidebar } = useSidebarStore()

  return (
    <Box w="100%" h="100%" className="bg-white shadow-md">
      <Flex
        align="center"
        px={isMobile ? 12 : 24}
        h="100%"
        justify="space-between"
      >
        <Flex gap={isMobile ? 10 : 20} align="center" w={'fit-content'}>
          {isMobile && (
            <ActionIcon variant="subtle" onClick={toggleSidebar}>
              <GIcon name="Menu" size={24} />
            </ActionIcon>
          )}
          <Link to="/app" className="transition-transform hover:scale-105">
            <Image
              src={Logo}
              h={isMobile ? 16 : 20}
              fit="contain"
              className="drop-shadow-md"
              my={'auto'}
              w={'auto'}
            />
          </Link>
        </Flex>
        {!hideSearchInput && !isMobile && (
          <Autocomplete
            leftSection={<GIcon name="ZoomCode" size={20} color="#4F46E5" />}
            w={isTablet ? 300 : 450}
            limit={10}
            radius="xl"
            filter={() => data.data}
            placeholder={isTablet ? 'Search' : 'Search in GspaceZ'}
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
        <Group gap={isMobile ? 12 : isTablet ? 16 : 20}>
          {location.pathname !== '/post/new' && (
            <Button
              component={Link}
              to="/post/new"
              radius="xl"
              variant="filled"
              className="bg-indigo-600 transition-colors duration-200 hover:bg-indigo-700"
              leftSection={
                <GIcon
                  name="Sparkles"
                  size={isMobile ? 16 : isTablet ? 16 : 18}
                />
              }
              px={isMobile ? 8 : isTablet ? 12 : 20}
              size={isMobile ? 'xs' : isTablet ? 'sm' : 'md'}
            >
              {isTablet ? 'New Post' : 'Create my new post'}
            </Button>
          )}
          <Popover withArrow width={isMobile ? 300 : 400}>
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                size={isMobile ? 'lg' : 'xl'}
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
                    <GIcon
                      name="Bell"
                      size={isMobile ? 24 : isTablet ? 26 : 28}
                    />
                  </Indicator>
                ) : (
                  <GIcon
                    name="Bell"
                    size={isMobile ? 24 : isTablet ? 26 : 28}
                  />
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
          <Box
            className="rounded-full bg-orange-200/50"
            px={isMobile ? 8 : isTablet ? 12 : 16}
            py={4}
          >
            <Tooltip
              withArrow
              color="orange"
              openDelay={300}
              label={`You have ${streakData} days of streak`}
            >
              <Group gap={isMobile ? 2 : 4}>
                <GIcon
                  name="FlameFilled"
                  size={isTablet ? 16 : 20}
                  color="#f66427"
                />
                <Text
                  c={'orange'}
                  size={isMobile ? 'sm' : 'md'}
                  className="!font-bold"
                >
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
                size={isMobile ? 'sm' : 'md'}
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
