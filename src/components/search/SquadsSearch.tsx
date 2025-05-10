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
  Divider,
  Loader
} from '@mantine/core'
import { useGSearch } from '../../hooks/useGSearch'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { GIcon } from '../common/GIcon'
import { useDark } from '../../hooks/useDark'
import { v4 as uuidv4 } from 'uuid'
import { useGemini } from '../../hooks/useGemini'
import { squadsPrompt } from '../../utils/search-prompt'

interface Props {
  searchText: string
  triggerSearch: boolean
  promptSearch: string
  useSupport: boolean
}

export const SquadsSearch = ({
  searchText,
  triggerSearch,
  promptSearch,
  useSupport
}: Props) => {
  const { searchSquads } = useGSearch()
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const { sendChatMessage } = useGemini()
  const [highlightIds, setHighlightIds] = useState<string[]>([])
  const { isDark } = useDark()

  const {
    data: squadsData,
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['search-squads', triggerSearch],
    queryFn: ({ pageParam }) =>
      searchSquads({ searchText, page: pageParam, size: 20 }),
    select: (data) => {
      return {
        squads: data.pages.map((page) => page.data.result.content).flat(),
        total: data.pages[0].data.result.totalElements
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.data.result.number + 1
      return nextPage < lastPage.data.result.totalPages ? nextPage : undefined
    }
  })

  const { mutate: highlightSquad, isPending: isHighlighting } = useMutation({
    mutationFn: () => {
      if (squadsData && promptSearch) {
        return sendChatMessage({
          content: squadsPrompt(squadsData.squads, promptSearch),
          sessionId: uuidv4().replace(/-/g, '').slice(0, 20)
        })
      }
      return Promise.reject(new Error('No squad data available'))
    },
    onSuccess: (response) => {
      const result = JSON.parse(response.data.result.content) as string[]
      setHighlightIds(result)
    }
  })

  useEffect(() => {
    if (useSupport) {
      highlightSquad()
    }
  }, [useSupport, highlightSquad, squadsData, triggerSearch])

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
    <Box
      bg={isDark ? 'gray.9' : 'white'}
      className={`rounded-lg shadow-sm ${isDark ? 'border border-gray-700' : 'border border-gray-200'}`}
    >
      <Box p="md">
        <Flex align="center" mb="md" justify={'space-between'}>
          <Flex align={'center'}>
            <GIcon name="Users" size={20} color="#4F46E5" />
            <Text ml={8} fw={600} size="lg" c="indigo.8">
              Squads
            </Text>
          </Flex>
          <Group gap={8}>
            {(isHighlighting || isLoading) && <Loader size={'sm'} />}
            {squadsData && (
              <Badge ml="auto" color="indigo" variant="light" radius="sm">
                {squadsData?.total} results
              </Badge>
            )}
          </Group>
        </Flex>
        <Divider mb="md" />
        <ScrollArea.Autosize mah="70vh">
          {isLoading && !squadsData ? (
            <Stack>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={80} radius="md" />
              ))}
            </Stack>
          ) : (
            <Stack gap={12}>
              {squadsData?.squads.length === 0 ? (
                <Flex direction="column" align="center" py={30}>
                  <GIcon name="UserSearch" size={48} color="#CBD5E1" />
                  <Text c="dimmed" mt={10}>
                    No squads found matching "{searchText}"
                  </Text>
                </Flex>
              ) : (
                squadsData?.squads.map((squad) => (
                  <Box
                    key={squad.tagName}
                    p={16}
                    component={Link}
                    to={`/squad/${squad.tagName}`}
                    bg={isDark ? 'gray.8' : 'white'}
                    className={`cursor-pointer rounded-lg border ${
                      highlightIds.includes(squad.id) && useSupport
                        ? `animate-gradient-x border-indigo-300 !bg-gradient-to-r ${isDark ? 'from-indigo-900/20 to-purple-900/20' : 'from-indigo-100/70 to-purple-100/70'}`
                        : isDark
                          ? 'border-gray-700'
                          : 'border-gray-200'
                    } transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm`}
                  >
                    <Group>
                      <Avatar
                        src={squad.avatarUrl}
                        size="md"
                        radius="xl"
                        className="border border-indigo-100"
                      />
                      <Stack gap={2} style={{ flex: 1 }}>
                        <Text fw={600} size="sm">
                          {squad.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          @{squad.tagName}
                        </Text>
                      </Stack>
                      <Badge
                        size="sm"
                        color={squad.privacy === 'PRIVATE' ? 'red' : 'green'}
                      >
                        {squad.privacy === 'PRIVATE' ? 'Private' : 'Public'}
                      </Badge>
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
        </ScrollArea.Autosize>
      </Box>
    </Box>
  )
}
