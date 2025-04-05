import {
  Avatar,
  Box,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text
} from '@mantine/core'
import { useGSearch } from '../../hooks/useGSearch'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

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
      return data.pages.map((page) => page.data.result.content).flat()
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
    <Box>
      <ScrollArea.Autosize mah={'80vh'}>
        <Stack gap={8}>
          {usersData?.map((user) => (
            <Box
              p={16}
              component={Link}
              to={`/profile/${user.id}`}
              className="cursor-pointer rounded-lg border border-gray-300 hover:border-indigo-200 hover:bg-indigo-50"
            >
              <Group gap={8}>
                <Avatar />
                <Stack gap={0} align="flex-start">
                  <Text>{`${user.firstName} ${user.lastName}`}</Text>
                  <Text size="sm" c="dimmed">
                    {user.email}
                  </Text>
                </Stack>
              </Group>
            </Box>
          ))}
          {hasNextPage && <Skeleton radius={'md'} h={80} ref={loaderRef} />}
        </Stack>
      </ScrollArea.Autosize>
    </Box>
  )
}
