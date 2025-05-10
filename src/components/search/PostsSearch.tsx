import {
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
import { useEffect, useRef, useState } from 'react'
import { GIcon } from '../common/GIcon'
import { useDark } from '../../hooks/useDark'
import { v4 as uuidv4 } from 'uuid'
import { useGemini } from '../../hooks/useGemini'
import { postsPrompt } from '../../utils/search-prompt'
import { GSimplePost } from '../common/GSimplePost'

interface Props {
  searchText: string
  triggerSearch: boolean
  promptSearch: string
  useSupport: boolean
}

export const PostsSearch = ({
  searchText,
  triggerSearch,
  promptSearch,
  useSupport
}: Props) => {
  const { searchPosts } = useGSearch()
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const { sendChatMessage } = useGemini()
  const [highlightIds, setHighlightIds] = useState<string[]>([])
  const { isDark } = useDark()

  const {
    data: postsData,
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['search-posts', triggerSearch],
    queryFn: ({ pageParam }) =>
      searchPosts({ searchText, page: pageParam, size: 10 }),
    select: (data) => {
      return {
        posts: data.pages.map((page) => page.data.result.content).flat(),
        total: data.pages[0].data.result.totalElements
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.data.result.number + 1
      return nextPage < lastPage.data.result.totalPages ? nextPage : undefined
    }
  })

  const { mutate: highlightPost, isPending: isHighlighting } = useMutation({
    mutationFn: () => {
      if (postsData && promptSearch) {
        return sendChatMessage({
          content: postsPrompt(postsData.posts, promptSearch),
          sessionId: uuidv4().replace(/-/g, '').slice(0, 20)
        })
      }
      return Promise.reject(new Error('No post data available'))
    },
    onSuccess: (response) => {
      const result = JSON.parse(response.data.result.content) as string[]
      setHighlightIds(result)
    }
  })

  useEffect(() => {
    if (useSupport) {
      highlightPost()
    }
  }, [useSupport, highlightPost, postsData, triggerSearch])

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
            <GIcon name="Document" size={20} color="#4F46E5" />
            <Text ml={8} fw={600} size="lg" c="indigo.8">
              Posts
            </Text>
          </Flex>
          <Group gap={8}>
            {(isHighlighting || isLoading) && <Loader size={'sm'} />}
            {postsData && (
              <Badge ml="auto" color="indigo" variant="light" radius="sm">
                {postsData?.total} results
              </Badge>
            )}
          </Group>
        </Flex>
        <Divider mb="md" />
        <ScrollArea.Autosize mah="70vh">
          {isLoading && !postsData ? (
            <Stack>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} height={150} radius="md" />
              ))}
            </Stack>
          ) : (
            <Stack gap={16}>
              {postsData?.posts.length === 0 ? (
                <Flex direction="column" align="center" py={30}>
                  <GIcon name="Document" size={48} color="#CBD5E1" />
                  <Text c="dimmed" mt={10}>
                    No posts found matching "{searchText}"
                  </Text>
                </Flex>
              ) : (
                postsData?.posts.map((post) => (
                  <Box
                    key={post.id}
                    className={`${
                      highlightIds.includes(post.id) && useSupport
                        ? `animate-gradient-x border-indigo-300 !bg-gradient-to-r ${isDark ? 'from-indigo-900/20 to-purple-900/20' : 'from-indigo-100/70 to-purple-100/70'}`
                        : ''
                    }`}
                  >
                    <GSimplePost post={post} />
                  </Box>
                ))
              )}
              {hasNextPage && (
                <Skeleton
                  radius="md"
                  h={150}
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
