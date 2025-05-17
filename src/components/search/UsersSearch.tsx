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
import { useGemini } from '../../hooks/useGemini'
import { usersPrompt } from '../../utils/search-prompt'
import { extractArrayFromLlmOutput } from '../../utils/llm-clean'

interface Props {
  searchText: string
  triggerSearch: boolean
  promptSearch: string
  useSupport: boolean
}

export const UsersSearch = ({
  searchText,
  triggerSearch,
  promptSearch,
  useSupport
}: Props) => {
  const { searchUsers } = useGSearch()
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const { sendQuickChat } = useGemini()
  const [highlightIds, setHighlightIds] = useState<string[]>([])

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

  const { mutate: highlightUser, isPending: isHighlighting } = useMutation({
    mutationFn: async () => {
      if (usersData && promptSearch) {
        console.log('AI')
        return await sendQuickChat({
          content: usersPrompt(usersData.users, promptSearch)
        })
      }
      return Promise.reject(new Error('No user data available'))
    },
    onSuccess: (response) => {
      try {
        const arr = extractArrayFromLlmOutput(response.data.result.content)
        console.log('Highlight ids:', arr)
        setHighlightIds(arr)
      } catch (err) {
        console.error(
          'Failed to extract array from LLM response:',
          response.data.result.content,
          err
        )
      }
    },
    onError: (error) => {
      console.error('Mutation error:', error)
    }
  })

  useEffect(() => {
    if (useSupport) {
      highlightUser()
    }
  }, [useSupport, highlightUser, usersData, triggerSearch])

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

  const { isDark } = useDark()

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
              Users
            </Text>
          </Flex>
          <Group gap={8}>
            {(isHighlighting || isLoading) && <Loader size={'sm'} />}
            {usersData && (
              <Badge ml="auto" color="indigo" variant="light" radius="sm">
                {usersData?.total} results
              </Badge>
            )}
          </Group>
        </Flex>
        <Divider mb="md" />
        <ScrollArea.Autosize mah="70vh">
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
                    key={user.profileTag}
                    p={16}
                    component={Link}
                    to={`/profile/${user.profileTag}`}
                    bg={isDark ? 'gray.8' : 'white'}
                    className={`cursor-pointer rounded-lg border ${
                      highlightIds.includes(user.id) && useSupport
                        ? `animate-gradient-x border-indigo-300 !bg-gradient-to-r ${isDark ? 'from-indigo-900/20 to-purple-900/20' : 'from-indigo-100/70 to-purple-100/70'}`
                        : isDark
                          ? 'border-gray-700'
                          : 'border-gray-200'
                    } transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm`}
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
                          @{user.profileTag}
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
        </ScrollArea.Autosize>
      </Box>
    </Box>
  )
}
