import {
  Avatar,
  Box,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Badge,
  Flex,
  Divider
} from '@mantine/core'
import { useGSearch } from '../../hooks/useGSearch'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { GIcon } from '../common/GIcon'

interface Props {
  searchText: string
  triggerSearch: boolean
}

export const UsersSearch = ({ searchText, triggerSearch }: Props) => {
  const { searchUsers } = useGSearch()
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const {
    data: usersData,
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['search-users', triggerSearch],
    queryFn: ({ pageParam }) =>
      searchUsers({ searchText, page: pageParam, size: 20 }),
    select: (data) => {
      return {
        users: data.pages.map((page) => page.data.result.content).flat(),
        total: data.pages[0].data.result.totalElements
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.data.result.number + 1
      return nextPage < lastPage.data.result.totalPages ? nextPage : undefined
    }
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasNextPage && !isLoading) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [isLoading, hasNextPage, fetchNextPage])

  return (
    <Box bg="white" className="rounded-lg shadow-sm">
      <ScrollArea.Autosize mah="80vh">
        <Box p="md">
          <Flex align="center" mb="md">
            <GIcon name="Users" size={20} color="#4F46E5" />
            <Text ml={8} fw={600} size="lg" c="indigo.8">
              Users
            </Text>
            {usersData && (
              <Badge ml="auto" color="indigo" variant="light" radius="sm">
                {usersData?.total} results
              </Badge>
            )}
          </Flex>
          <Divider mb="md" />

          {isLoading && !usersData ? (
            <Stack>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={80} radius="md" />
              ))}
            </Stack>
          ) : (
            <Stack gap={12}>
              {usersData?.users.length === 0 ? (
                <Flex direction="column" align="center" py={30}>
                  <GIcon name="UserSearch" size={48} color="#CBD5E1" />
                  <Text c="dimmed" mt={10}>
                    No users found matching "{searchText}"
                  </Text>
                </Flex>
              ) : (
                usersData?.users.map((user) => (
                  <Box
                    key={user.id}
                    p={16}
                    component={Link}
                    to={`/profile/${user.id}`}
                    className="cursor-pointer rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm"
                  >
                    <Group>
                      <Avatar
                        src={user.avatarUrl}
                        size="md"
                        radius="xl"
                        className="border border-indigo-100"
                      />
                      <Stack gap={2} style={{ flex: 1 }}>
                        <Text
                          fw={600}
                          size="sm"
                        >{`${user.firstName} ${user.lastName}`}</Text>
                        <Text size="xs" c="dimmed">
                          {user.email}
                        </Text>
                      </Stack>
                      <GIcon name="ChevronRight" size={16} color="#94A3B8" />
                    </Group>
                  </Box>
                ))
              )}
              {hasNextPage && (
                <Skeleton
                  radius="md"
                  h={80}
                  ref={loaderRef}
                  className="animate-pulse"
                />
              )}
            </Stack>
          )}
        </Box>
      </ScrollArea.Autosize>
    </Box>
  )
}
