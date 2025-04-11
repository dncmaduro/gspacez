import { createFileRoute, Link } from '@tanstack/react-router'
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
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { useProfile } from '../../hooks/useProfile'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { useMe } from '../../hooks/useMe'
import { usePost } from '../../hooks/usePost'
import { useEffect, useRef, useState } from 'react'
import { GetLikedPostsByProfileResponse, GetPostsByProfileResponse } from '../../hooks/models'
import GProfilePosts from '../../components/common/GProfilePosts'
import { GProfileSquads } from '../../components/common/GProfileSquads'

export const Route = createFileRoute('/me/')({
  component: RouteComponent
})

function RouteComponent() {
  const { getJoinedSquads } = useProfile()
  const { getPostsByProfile, getLikedPostsByProfile } = usePost()
  const [activeTab, setActiveTab] = useState<'posts' | 'upvoted'>('posts')
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const pageSize = 5

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
    isLoading: isPostLoading, 
  } = useInfiniteQuery({
      queryKey: ['get-posts-by-profile', profileId],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await getPostsByProfile(profileId!, {pageNum: pageParam, pageSize })
        return response.data
      },
      getNextPageParam: (
        lastPage: GetPostsByProfileResponse,
        allPages: GetPostsByProfileResponse[]
      ) => {
        return lastPage.result.length === pageSize
          ? allPages.length
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
    isLoading: isLikedPostLoading,
  } = useInfiniteQuery({
    queryKey: ['get-liked-posts-by-profile', profileId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getLikedPostsByProfile(profileId!, {
        size: pageSize,
        page: pageParam,
      })
      return response.data
    },
    getNextPageParam: (
      lastPage: GetLikedPostsByProfileResponse,
      allPages: GetLikedPostsByProfileResponse[]
    ) => {
      return lastPage.result.length === pageSize
        ? allPages.length
        : undefined
    },
    initialPageParam: 0,
    enabled: !!profileId
  })
  const posts = postData?.pages.flatMap((page) => page.result) || []
  const likedPosts = likedPostData?.pages.flatMap((page) => page.result) || []

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
  
  const currentTabData = tabConfig[(activeTab as 'posts' | 'upvoted') ?? 'posts'] || tabConfig['posts']

  const handleTabChange = (tab: string | null) => {
    if (!tab || !(tab in tabConfig)) return
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
  }, [loaderRef, currentTabData.fetchNextPage, currentTabData.hasNextPage, currentTabData.isFetchingNextPage, currentTabData])

  return (
    <AppLayout>
      <Box maw={1000} mx="auto" px={12}>
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
                    <Group gap={8}>
                      <GIcon name="Location" size={16} />
                      <Text size="sm">{profileData?.country}</Text>
                    </Group>
                    <Button
                      variant="subtle"
                      size="compact-sm"
                      component={Link}
                      to="/me/edit"
                      leftSection={<GIcon name="Pencil" size={16} />}
                    >
                      Edit your profile
                    </Button>
                  </Stack>
                </Box>
                <GProfileSquads squads={joinedSquads} />
                <Box
                  className="rounded-lg border border-indigo-200"
                  p={16}
                  bg={'white'}
                >
                  <Text size="md">View other social accounts</Text>
                </Box>
              </Stack>
              <Box
                className="grow rounded-lg border border-indigo-200"
                bg={'white'}
              >
                <Tabs defaultValue={currentTabData.value} onChange={handleTabChange}>
                  <Tabs.List h={44}>
                    {Object.values(tabConfig).map((tab, index) => (
                      <Tabs.Tab key={index} value={tab.value}>
                        {tab.label}
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                  <Tabs.Panel value={currentTabData.value}>
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
