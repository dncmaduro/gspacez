import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch
} from '@tanstack/react-router'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  Box,
  Flex,
  Stack,
  Group,
  Text,
  Avatar,
  Loader,
  Tabs,
  Button,
  Divider
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { useProfile } from '../../hooks/useProfile'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { useMe } from '../../hooks/useMe'
import { usePost } from '../../hooks/usePost'
import { useEffect, useRef, useState } from 'react'
import GProfilePosts from '../../components/common/GProfilePosts'
import { GProfileSquads } from '../../components/common/GProfileSquads'

export const Route = createFileRoute('/me/')({
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
  const search = useSearch({ from: Route.fullPath })
  const navigate = useNavigate({ from: Route.fullPath })

  const defaultTab = search.tab === 'upvoted' ? 'upvoted' : 'posts'
  const [activeTab, setActiveTab] = useState<'posts' | 'upvoted'>(defaultTab)

  const loaderRef = useRef<HTMLDivElement | null>(null)
  const pageSize = 5

  useEffect(() => {
    if (!search.tab) {
      navigate({ search: { tab: 'posts' } })
    }
  }, [search.tab, navigate])

  const { getJoinedSquads } = useProfile()
  const { getPostsByProfile, getLikedPostsByProfile } = usePost()

  const { data: profileData, isLoading } = useMe()
  const profileId = profileData?.id

  const { data: squadsData } = useQuery({
    queryKey: ['get-joined-squads', profileId],
    queryFn: () => getJoinedSquads(profileId!),
    enabled: !!profileId
  })

  const joinedSquads = squadsData?.data.result || []

  const {
    data: postData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPostLoading
  } = useInfiniteQuery({
    queryKey: ['get-posts-by-profile', profileId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getPostsByProfile(profileId!, {
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
    initialPageParam: 0,
    enabled: !!profileId
  })

  const {
    data: likedPostData,
    fetchNextPage: fetchNextLikedPage,
    hasNextPage: hasNextLikedPage,
    isFetchingNextPage: isFetchingNextLikedPage,
    isLoading: isLikedPostLoading
  } = useInfiniteQuery({
    queryKey: ['get-liked-posts-by-profile', profileId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getLikedPostsByProfile(profileId!, {
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
    enabled: !!profileId
  })
  const posts = postData?.pages.flatMap((page) => page.result.content) || []
  const likedPosts =
    likedPostData?.pages.flatMap((page) => page.result.content) || []

  const tabConfig = {
    posts: {
      label: 'Posts',
      value: 'posts',
      posts: posts,
      isLoading: isPostLoading,
      hasNextPage: hasNextPage,
      fetchNextPage: fetchNextPage,
      isFetchingNextPage: isFetchingNextPage
    },
    upvoted: {
      label: 'Upvoted',
      value: 'upvoted',
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
                  className="rounded-lg border border-indigo-200 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  bg={'white'}
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

                    <Divider w="100%" color="gray.2" />

                    <Stack gap={12} w="100%">
                      <Group gap={12}>
                        <GIcon name="Calendar" size={18} color="#4F46E5" />
                        <Text size="sm" fw={500}>
                          {profileData?.dob || 'Not specified'}
                        </Text>
                      </Group>
                      <Group gap={12}>
                        <GIcon name="Location" size={18} color="#4F46E5" />
                        <Text size="sm" fw={500}>
                          {profileData?.country || 'Not specified'}
                        </Text>
                      </Group>
                      {/* <Group gap={12}>
                        <GIcon name="Mail" size={18} color="#4F46E5" />
                        <Text size="sm" fw={500}>
                          {profileData?.email || 'Not specified'}
                        </Text>
                      </Group> */}
                    </Stack>

                    <Button
                      variant="light"
                      color="indigo"
                      size="md"
                      radius="md"
                      fullWidth
                      component={Link}
                      to="/me/edit"
                      leftSection={<GIcon name="Pencil" size={16} />}
                      className="transition-transform duration-200 hover:scale-105"
                    >
                      Edit your profile
                    </Button>
                  </Stack>
                </Box>

                {/* Squads Card */}
                <GProfileSquads squads={joinedSquads} />

                {/* Social Accounts Card */}
                <Box
                  className="rounded-lg border border-indigo-200 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  p={24}
                  bg={'white'}
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
                className="grow rounded-lg border border-indigo-200 shadow-sm transition-shadow duration-300 hover:shadow-md"
                maw={'68%'}
                bg={'white'}
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
                    className="border-b border-indigo-100 bg-gray-50"
                  >
                    {Object.values(tabConfig).map((tab, index) => (
                      <Tabs.Tab
                        key={index}
                        value={tab.value}
                        leftSection={
                          tab.value === 'posts' ? (
                            <GIcon name="Article" size={16} />
                          ) : (
                            <GIcon name="ThumbUp" size={16} />
                          )
                        }
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
                              ? "You haven't created any posts yet"
                              : "You haven't upvoted any posts yet"}
                          </Text>
                          {activeTab === 'posts' && (
                            <Button
                              component={Link}
                              to="/post/create"
                              variant="light"
                              leftSection={<GIcon name="Plus" size={16} />}
                            >
                              Create your first post
                            </Button>
                          )}
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
  )
}
