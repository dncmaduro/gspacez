import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useGSearch } from '../../hooks/useGSearch'
import { Box, ScrollArea, Stack, Text, Badge, Flex } from '@mantine/core'
import { GSimplePost } from '../common/GSimplePost'
import { GSimplePostSkeleton } from '../common/GSimplePostSkeleton'
import { GIcon } from '../common/GIcon'

interface Props {
  searchText: string
  triggerSearch: boolean
}

export const PostsSearch = ({ searchText, triggerSearch }: Props) => {
  const { searchPosts } = useGSearch()
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const {
    data: postsData,
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['search-posts', triggerSearch],
    queryFn: ({ pageParam }) =>
      searchPosts({ searchText, page: pageParam, size: 20 }),
    select: (data) => {
      return {
        posts: data.pages.map((page) => page.data.result.content).flat(),
        total: data.pages[0]?.data.result.totalElements || 0
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
    <Box>
      <ScrollArea.Autosize mah={'80vh'}>
        <Box p="md">
          <Flex align="center" mb="md">
            <GIcon name="FilePencil" size={20} color="#4F46E5" />
            <Text ml={8} fw={600} size="lg" c="indigo.8">
              Posts
            </Text>
            {postsData && (
              <Badge ml="auto" color="indigo" variant="light" radius="sm">
                {postsData.total} results
              </Badge>
            )}
          </Flex>

          <Stack gap={8}>
            {isLoading ? (
              [...Array(5)].map((_, i) => <GSimplePostSkeleton key={i} />)
            ) : postsData?.posts.length === 0 ? (
              <Box py={20} className="text-center">
                <Text c="dimmed">No posts found matching "{searchText}"</Text>
              </Box>
            ) : (
              <>
                {postsData?.posts.map((post) => (
                  <GSimplePost key={post.id} post={post} />
                ))}
                {hasNextPage && (
                  <Box ref={loaderRef}>
                    <GSimplePostSkeleton />
                  </Box>
                )}
              </>
            )}
          </Stack>
        </Box>
      </ScrollArea.Autosize>
    </Box>
  )
}
