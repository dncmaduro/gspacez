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
  Text
} from '@mantine/core'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useProfile } from '../../hooks/useProfile'
import { GIcon } from '../../components/common/GIcon'
import GProfilePosts from '../../components/common/GProfilePosts'
import { usePost } from '../../hooks/usePost'
import { useEffect, useRef, useState } from 'react'
import {
  GetLikedPostsByProfileResponse,
  GetPostsByProfileResponse
} from '../../hooks/models'
import { GProfileSquads } from '../../components/common/GProfileSquads'

export const Route = createFileRoute('/profile/$profileId')({
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
  const { profileId } = useParams({ from: `/profile/$profileId` })
  const search = useSearch({ from: Route.fullPath })
  const navigate = useNavigate({ from: Route.fullPath })

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
    queryKey: ['get-profile'],
    queryFn: () => {
      return getProfile(profileId)
    }
  })

  const profileData = data?.data.result

  const { data: squadsData } = useQuery({
    queryKey: ['get-joined-squads', profileId],
    queryFn: () => getJoinedSquads(profileId)
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
      const response = await getPostsByProfile(profileId, {
        pageNum: pageParam,
        pageSize
      })
      return response.data
    },
    getNextPageParam: (
      lastPage: GetPostsByProfileResponse,
      allPages: GetPostsByProfileResponse[]
    ) => {
      return lastPage.result.content.length === pageSize ? allPages.length : undefined
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
    queryKey: ['get-liked-posts-by-profile', profileId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getLikedPostsByProfile(profileId!, {
        size: pageSize,
        page: pageParam
      })
      return response.data
    },
    getNextPageParam: (
      lastPage: GetLikedPostsByProfileResponse,
      allPages: GetLikedPostsByProfileResponse[]
    ) => {
      return lastPage.result.content.length === pageSize ? allPages.length : undefined
    },
    initialPageParam: 0,
    enabled: !!profileId
  })
  const posts = postData?.pages.flatMap((page) => page.result.content) || []
  const likedPosts = likedPostData?.pages.flatMap((page) => page.result.content) || []

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
      <Box maw={1200} mx="auto" px={12}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Flex h="100%" gap={8} mih={1000}>
              <Stack w="30%" gap={4}>
                <Box
                  className="rounded-lg border border-indigo-200"
                  bg={'white'}
                  p={16}
                >
                  <Stack gap={16}>
                    <Group gap={8}>
                      <Avatar src={profileData?.avatarUrl} size="md" />
                      <Text className="!text-[17px] !font-bold">
                        {profileData?.firstName} {profileData?.lastName}
                      </Text>
                    </Group>
                    <Group gap={8}>
                      <GIcon name="Calendar" size={16} />
                      <Text size="sm">{profileData?.dob}</Text>
                    </Group>
                  </Stack>
                </Box>
                <GProfileSquads squads={joinedSquads} />
                <Box
                  className="rounded-lg border border-indigo-200"
                  bg={'white'}
                  p={16}
                >
                  <Text size="md">View other social accounts</Text>
                </Box>
              </Stack>
              <Box
                className="grow rounded-lg border border-indigo-200"
                maw={'66%'}
                bg={'white'}
              >
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tabs.List h={44}>
                    {Object.values(tabConfig).map((tab, index) => (
                      <Tabs.Tab key={index} value={tab.value}>
                        {tab.label}
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                  <Tabs.Panel value={activeTab}>
                    <GProfilePosts
                      posts={currentTabData.posts}
                      isLoading={currentTabData.isLoading}
                      hasNextPage={currentTabData.hasNextPage}
                      loaderRef={loaderRef}
                    />
                  </Tabs.Panel>
                </Tabs>
              </Box>
            </Flex>
          </>
        )}
      </Box>
    </AppLayout>
  )
}
