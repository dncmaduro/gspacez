import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useGSearch } from '../../hooks/useGSearch'
import { Box, ScrollArea, Stack } from '@mantine/core'
import { GSimplePost } from '../common/GSimplePost'

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
          {postsData?.map((post) => <GSimplePost key={post.id} post={post} />)}
        </Stack>
      </ScrollArea.Autosize>
    </Box>
  )
}
