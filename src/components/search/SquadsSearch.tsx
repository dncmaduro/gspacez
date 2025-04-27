import { useGSearch } from '../../hooks/useGSearch'
import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  Avatar,
  Box,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Flex,
  Badge,
  Divider
} from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { GIcon } from '../../components/common/GIcon'

interface Props {
  searchText: string
  triggerSearch: boolean
}

export const SquadsSearch = ({ searchText, triggerSearch }: Props) => {
  const { searchSquads } = useGSearch()
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const {
    data: squadsData,
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['search-squads', searchText, triggerSearch],
    queryFn: ({ pageParam }) =>
      searchSquads({ searchText, page: pageParam, size: 20 }),
    select: (data) => {
      return {
        squads: data.pages.map((page) => page.data.result.content).flat(),
        total: data.pages[0]?.data.result.totalElements || 0
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.data.result.number + 1
      return nextPage < lastPage.data.result.totalPages ? nextPage : undefined
    },
    enabled: !!searchText
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
              Squads
            </Text>
            {squadsData && (
              <Badge ml="auto" color="indigo" variant="light" radius="sm">
                {squadsData.total} results
              </Badge>
            )}
          </Flex>
          <Divider mb="md" />

          {isLoading ? (
            <Stack>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={80} radius="md" />
              ))}
            </Stack>
          ) : (
            <Stack gap={8}>
              {squadsData?.squads?.length === 0 ? (
                <Box py={20} className="text-center">
                  <Text c="dimmed">
                    No squads found matching "{searchText}"
                  </Text>
                </Box>
              ) : (
                squadsData?.squads?.map((squad) => (
                  <Box
                    key={squad.id || squad.tagName}
                    p={16}
                    component={Link}
                    to={`/squad/${squad.tagName}`}
                    className="cursor-pointer rounded-lg border border-gray-300 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm"
                  >
                    <Group gap={12}>
                      <Avatar src={squad.avatarUrl} size="md" radius="xl" />
                      <Stack gap={2} align="flex-start" style={{ flex: 1 }}>
                        <Group justify="apart" w="100%">
                          <Text fw={500}>{squad.name}</Text>
                          <Badge
                            color={
                              squad.privacy === 'PRIVATE' ? 'red' : 'indigo'
                            }
                            variant="light"
                            leftSection={
                              <GIcon
                                name={
                                  squad.privacy === 'PRIVATE'
                                    ? 'LockFilled'
                                    : 'World'
                                }
                                size={14}
                              />
                            }
                          >
                            {squad.privacy}
                          </Badge>
                        </Group>
                        <Text size="sm" c="dimmed">
                          @{squad.tagName}
                        </Text>
                        <Group mt={8} gap={12}>
                          <Group
                            gap={4}
                            className="rounded-full bg-gray-50 px-2 py-1"
                          >
                            <GIcon name="Users" size={14} color="#4263eb" />
                            <Text size="xs" fw={500}>
                              {squad.totalMembers || 0} members
                            </Text>
                          </Group>
                          <Group
                            gap={4}
                            className="rounded-full bg-gray-50 px-2 py-1"
                          >
                            <GIcon
                              name="FilePencil"
                              size={14}
                              color="#4263eb"
                            />
                            <Text size="xs" fw={500}>
                              {squad.totalPosts || 0} posts
                            </Text>
                          </Group>
                        </Group>
                      </Stack>
                    </Group>
                  </Box>
                ))
              )}
              {hasNextPage && <Skeleton radius="md" h={80} ref={loaderRef} />}
            </Stack>
          )}
        </Box>
      </ScrollArea.Autosize>
    </Box>
  )
}
