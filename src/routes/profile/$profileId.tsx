import { createFileRoute, Link, useParams } from '@tanstack/react-router'
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
  Tooltip
} from '@mantine/core'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useProfile } from '../../hooks/useProfile'
import { GIcon } from '../../components/common/GIcon'
import GProfilePosts from '../../components/common/GProfilePosts'
import { usePost } from '../../hooks/usePost'
import { useEffect, useRef } from 'react'
import { GetPostsByProfileResponse } from '../../hooks/models'

export const Route = createFileRoute('/profile/$profileId')({
  component: RouteComponent
})

function RouteComponent() {
  const { getProfile, getJoinedSquads } = useProfile()
  const { getPostsByProfile } = usePost()
  const { profileId } = useParams({ from: `/profile/$profileId` })
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const pageSize = 5

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
    isLoading: isPostLoading, 
  } = useInfiniteQuery({
      queryKey: ['get-posts-by-profile', profileId],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await getPostsByProfile(profileId, {pageNum: pageParam, pageSize })
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
      initialPageParam: 0
    })
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )
    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])
  const posts = postData?.pages.flatMap((page) => page.result) || []

  const tabs = [
    {
      label: 'Posts',
      value: 'posts',
      item: (
        <GProfilePosts
          posts={posts}
          isLoading={isPostLoading}
          hasNextPage={hasNextPage}
          loaderRef={loaderRef}
        />
      )
    },
    {
      label: 'Upvoted',
      value: 'upvoted',
      item: <></>
    }
  ]

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
                  </Stack>
                </Box>
                <Box
                  className="rounded-lg border border-indigo-200"
                  bg={'white'}
                  p={16}
                >
                  <Text size="md">Involved Squads</Text>
                  {!joinedSquads || joinedSquads.length === 0 ? (
                    <Text c="dimmed" size="sm">
                      You haven't joined any squads yet. Join one to start your
                      journey!
                    </Text>
                  ) : (
                    <Group pt={10}>
                      <Tooltip.Group openDelay={300} closeDelay={100}>
                        <Box
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 16
                          }}
                        >
                          {joinedSquads.map((squad) => (
                            <Tooltip label={squad.name} withArrow>
                              <Link to={`/squad/${squad.tagName}`}>
                                <Avatar
                                  src={squad.avatarUrl}
                                  radius="xl"
                                  size="md"
                                  style={{
                                    cursor: 'pointer',
                                    border: '2px solid #ccc'
                                  }}
                                />
                              </Link>
                            </Tooltip>
                          ))}
                        </Box>
                      </Tooltip.Group>
                    </Group>
                  )}
                </Box>
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
                bg={'white'}
              >
                <Tabs defaultValue={tabs[0].value}>
                  <Tabs.List h={44}>
                    {tabs.map((tab) => (
                      <Tabs.Tab key={tab.value} value={tab.value}>
                        <span className="font-bold">{tab.label}</span>
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                  {tabs.map((tab) => (
                    <Tabs.Panel key={tab.value} value={tab.value}>
                      {tab.item}
                    </Tabs.Panel>
                  ))}
                </Tabs>
              </Box>
            </Flex>
          </>
        )}
      </Box>
    </AppLayout>
  )
}
