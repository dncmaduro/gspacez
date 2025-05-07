import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch
} from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Avatar,
  Box,
  Flex,
  Group,
  Loader,
  Stack,
  Tabs,
  Text,
  Divider,
  ActionIcon,
  Tooltip,
  Button
} from '@mantine/core'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useProfile } from '../../hooks/useProfile'
import { GIcon } from '../../components/common/GIcon'
import GProfilePosts from '../../components/common/GProfilePosts'
import { usePost } from '../../hooks/usePost'
import { useEffect, useRef, useState } from 'react'
import { GProfileSquads } from '../../components/common/GProfileSquads'
import { Helmet } from 'react-helmet-async'
import { useDark } from '../../hooks/useDark'

export const Route = createFileRoute('/profile/$profileTag')({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      tab:
        search.tab === 'posts' || search.tab === 'upvoted'
          ? search.tab
          : undefined
    }
  }
})

function RouteComponent() {
  const { profileTag } = useParams({ from: `/profile/$profileTag` })
  const search = useSearch({ from: Route.fullPath })
  const navigate = useNavigate({ from: Route.fullPath })
  const { isDark } = useDark()

  const defaultTab = search.tab === 'upvoted' ? 'upvoted' : 'posts'
  const [activeTab, setActiveTab] = useState<'posts' | 'upvoted'>(defaultTab)

  const loaderRef = useRef<HTMLDivElement | null>(null)
  const pageSize = 5

  const { getProfile, getJoinedSquads } = useProfile()
  const { getPostsByProfile, getLikedPostsByProfile } = usePost()

  useEffect(() => {
    if (!search.tab) {
      navigate({ search: { tab: 'posts' } })
    }
  }, [search.tab, navigate])

  const { data, isLoading } = useQuery({
    queryKey: ['get-profile', profileTag],
    queryFn: () => {
      return getProfile(profileTag)
    }
  })

  const profileData = data?.data.result

  const { data: squadsData } = useQuery({
    queryKey: ['get-joined-squads', profileTag],
    queryFn: () => getJoinedSquads(profileTag)
  })

  const joinedSquads = squadsData?.data.result || []

  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPostLoading
  } = useInfiniteQuery({
    queryKey: ['get-posts-by-profile', profileTag],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getPostsByProfile(profileTag, {
        pageNum: pageParam,
        pageSize
      })
      return response.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.result.number + 1 < lastPage.result.totalPages
        ? lastPage.result.number + 1
        : undefined
    },
    initialPageParam: 0
  })

  const {
    data: likedPostData,
    fetchNextPage: fetchNextLikedPage,
    hasNextPage: hasNextLikedPage,
    isFetchingNextPage: isFetchingNextLikedPage,
    isLoading: isLikedPostLoading
  } = useInfiniteQuery({
    queryKey: ['get-liked-posts-by-profile', profileTag],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getLikedPostsByProfile(profileTag, {
        size: pageSize,
        page: pageParam
      })
      return response.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.result.number + 1 < lastPage.result.totalPages
        ? lastPage.result.number + 1
        : undefined
    },
    initialPageParam: 0,
    enabled: !!profileTag
  })

  const posts = postData?.pages.flatMap((page) => page.result.content) || []
  const likedPosts =
    likedPostData?.pages.flatMap((page) => page.result.content) || []

  const tabConfig = {
    posts: {
      label: 'Posts',
      value: 'posts',
      icon: 'Article',
      posts: posts,
      isLoading: isPostLoading,
      hasNextPage: hasNextPage,
      fetchNextPage: fetchNextPage,
      isFetchingNextPage: isFetchingNextPage
    },
    upvoted: {
      label: 'Upvoted',
      value: 'upvoted',
      icon: 'ThumbUp',
      posts: likedPosts,
      isLoading: isLikedPostLoading,
      hasNextPage: hasNextLikedPage,
      fetchNextPage: fetchNextLikedPage,
      isFetchingNextPage: isFetchingNextLikedPage
    }
  }

  const currentTabData = tabConfig[activeTab] || tabConfig['posts']

  const handleTabChange = (tab: string | null) => {
    if (!tab || !(tab in tabConfig)) return
    navigate({ search: (prev: { tab?: string }) => ({ ...prev, tab }) })
    setActiveTab(tab as 'posts' | 'upvoted')
  }

  useEffect(() => {
    if (!loaderRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          currentTabData.hasNextPage &&
          !currentTabData.isFetchingNextPage
        ) {
          currentTabData.fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    observer.observe(loaderRef.current)

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [
    loaderRef,
    currentTabData.fetchNextPage,
    currentTabData.hasNextPage,
    currentTabData.isFetchingNextPage,
    currentTabData
  ])

  return (
    <>
      <Helmet>
        <title>
          {profileData
            ? `${profileData.firstName} ${profileData.lastName} - Profile`
            : 'User Profile'}{' '}
          - GspaceZ
        </title>
      </Helmet>
      <AppLayout>
        <Box maw={1200} mx="auto" px={12} py={24}>
          {isLoading ? (
            <Flex h="70vh" align="center" justify="center">
              <Loader size="lg" color="indigo" />
            </Flex>
          ) : (
            <>
              <Flex h="100%" gap={16} mih={1000}>
                {/* Sidebar */}
                <Stack w="30%" gap={16}>
                  {/* Profile Card */}
                  <Box
                    className={`rounded-lg border ${isDark ? 'border-indigo-700' : 'border-indigo-200'} shadow-sm transition-shadow duration-300 hover:shadow-md`}
                    bg={isDark ? 'gray.8' : 'white'}
                    p={24}
                  >
                    <Stack gap={24} align="center">
                      <Avatar
                        src={profileData?.avatarUrl}
                        size={100}
                        radius={100}
                        className="border-4 border-indigo-100 shadow-md"
                      />
                      <Text className="!text-center !text-xl !font-bold text-indigo-900">
                        {profileData?.firstName} {profileData?.lastName}
                      </Text>

                      <Group>
                        <Tooltip label="Message">
                          <ActionIcon
                            variant="light"
                            color="indigo"
                            size="lg"
                            radius="xl"
                            className="transition-transform duration-200 hover:scale-105"
                          >
                            <GIcon name="Message" size={20} />
                          </ActionIcon>
                        </Tooltip>
                        <Button
                          variant="outline"
                          color="indigo"
                          radius="xl"
                          leftSection={<GIcon name="UserPlus" size={16} />}
                          className="transition-all duration-200 hover:bg-indigo-50"
                        >
                          Follow
                        </Button>
                      </Group>

                      <Divider w="100%" color="gray.2" />

                      <Stack gap={12} w="100%">
                        <Group gap={12}>
                          <GIcon name="Calendar" size={18} color="#4F46E5" />
                          <Text size="sm" fw={500}>
                            {profileData?.dob || 'Not specified'}
                          </Text>
                        </Group>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Squads Card */}
                  <GProfileSquads squads={joinedSquads} />

                  {/* Social Accounts Card */}
                  <Box
                    className={`rounded-lg border ${isDark ? 'border-indigo-700' : 'border-indigo-200'} shadow-sm transition-shadow duration-300 hover:shadow-md`}
                    p={24}
                    bg={isDark ? 'gray.8' : 'white'}
                  >
                    <Stack gap={16}>
                      <Group gap={12}>
                        <GIcon name="Share" size={20} color="#4F46E5" />
                        <Text size="lg" fw={600}>
                          Social Accounts
                        </Text>
                      </Group>

                      <Divider color="gray.2" />

                      <Button
                        variant="light"
                        color="blue"
                        leftSection={<GIcon name="BrandTwitter" size={18} />}
                        fullWidth
                      >
                        Connect Twitter
                      </Button>
                      <Button
                        variant="light"
                        color="indigo"
                        leftSection={<GIcon name="BrandLinkedin" size={18} />}
                        fullWidth
                      >
                        Connect LinkedIn
                      </Button>
                      <Button
                        variant="light"
                        color="gray"
                        leftSection={<GIcon name="BrandGithub" size={18} />}
                        fullWidth
                      >
                        Connect GitHub
                      </Button>
                    </Stack>
                  </Box>
                </Stack>

                {/* Main Content */}
                <Box
                  className={`grow rounded-lg border ${isDark ? 'border-indigo-700' : 'border-indigo-200'} shadow-sm transition-shadow duration-300 hover:shadow-md`}
                  maw={'68%'}
                  bg={isDark ? 'gray.8' : 'white'}
                >
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    color="indigo"
                    radius="md"
                  >
                    <Tabs.List
                      h={60}
                      px={16}
                      className={`border-b ${isDark ? 'border-indigo-700' : 'border-indigo-100'} ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                    >
                      {Object.values(tabConfig).map((tab) => (
                        <Tabs.Tab
                          key={tab.value}
                          value={tab.value}
                          leftSection={<GIcon name={tab.icon} size={16} />}
                          className="text-base font-medium"
                        >
                          {tab.label}
                        </Tabs.Tab>
                      ))}
                    </Tabs.List>

                    <Box p={16}>
                      <Tabs.Panel value={activeTab}>
                        {currentTabData.posts.length === 0 &&
                        !currentTabData.isLoading ? (
                          <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            h={300}
                            gap={16}
                          >
                            <GIcon
                              name={
                                activeTab === 'posts'
                                  ? 'FileDescription'
                                  : 'ThumbUp'
                              }
                              size={48}
                              color="#E5E7EB"
                            />
                            <Text c="dimmed" size="lg" ta="center">
                              {activeTab === 'posts'
                                ? 'No posts yet'
                                : 'No upvoted posts yet'}
                            </Text>
                          </Flex>
                        ) : (
                          <GProfilePosts
                            posts={currentTabData.posts}
                            isLoading={currentTabData.isLoading}
                            hasNextPage={currentTabData.hasNextPage}
                            loaderRef={loaderRef}
                          />
                        )}
                      </Tabs.Panel>
                    </Box>
                  </Tabs>
                </Box>
              </Flex>
            </>
          )}
        </Box>
      </AppLayout>
    </>
  )
}
