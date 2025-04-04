import { useSelector } from 'react-redux'
import { useGSearch } from '../../hooks/useGSearch'
import { RootState } from '../../store/store'
import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  Avatar,
  Box,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text
} from '@mantine/core'
import { Link } from '@tanstack/react-router'

interface Props {
  searchText: string
  triggerSearch: boolean
}

export const SquadsSearch = ({ searchText, triggerSearch }: Props) => {
  const { searchSquads } = useGSearch()
  const token = useSelector((state: RootState) => state.auth.token)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const {
    data: squadsData,
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['search-squads', triggerSearch],
    queryFn: ({ pageParam }) =>
      searchSquads({ searchText, page: pageParam, size: 20 }, token),
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
          {squadsData?.map((squad) => (
            <Box
              p={16}
              component={Link}
              to={`/squad/${squad.tagName}`}
              className="cursor-pointer rounded-lg border border-gray-300 hover:border-indigo-200 hover:bg-indigo-50"
            >
              <Group gap={8}>
                <Avatar src={squad.avatarUrl} />
                <Stack gap={0} align="flex-start">
                  <Text>{squad.name}</Text>
                  <Text size="sm" c="dimmed">
                    {squad.tagName}
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
