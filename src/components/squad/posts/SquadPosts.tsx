import { useInfiniteQuery } from '@tanstack/react-query'
import { useSquad } from '../../../hooks/useSquad'
import { Box, Group, Skeleton, Stack, Text } from '@mantine/core'
import { GSimplePost } from '../../common/GSimplePost'
import { useEffect, useRef } from 'react'

interface Props {
  tagName: string
  totalPosts: number
}

export const SquadPosts = ({ tagName, totalPosts }: Props) => {
  const { getSquadPosts } = useSquad()
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const {
    data: postsData,
    hasNextPage,
    isLoading,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['get-squad-posts', tagName],
    queryFn: ({ pageParam }) =>
      getSquadPosts(tagName, { page: pageParam, size: 10 }),
    select: (data) => {
      return data.pages[0].data.result
    },
    initialPageParam: 0,
    getNextPageParam: () => {
      // BE bug
      const nextPage = 1
      return nextPage < Math.ceil(totalPosts / 10) ? nextPage : undefined
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
    <Box mx="auto" w={800} mt={32} className="text-center">
      <Stack gap={24}>
        {postsData && postsData[0] ? (
          <>
            {postsData?.map((post, index) => (
              <GSimplePost key={index} post={post} />
            ))}
            {hasNextPage ? (
              <Box
                className="rounded-lg border border-gray-300"
                p={16}
                ref={loaderRef}
              >
                <Group>
                  <Skeleton h={44} w={44} radius={'xl'} />
                  <Stack gap={4} align="flex-start">
                    <Skeleton h={16} w={120} radius={'xl'} />
                    <Skeleton h={12} w={100} radius={'xl'} />
                  </Stack>
                </Group>
                <Stack mt={32} gap={8} align="center">
                  <Stack gap={8}>
                    <Skeleton h={16} w={400} radius={'xl'} />
                    <Skeleton h={16} w={200} radius={'xl'} />
                    <Skeleton h={16} w={400} radius={'xl'} />
                  </Stack>
                </Stack>
              </Box>
            ) : (
              <Stack gap={8} mt={16} align="center">
                <Text>There are no more pages.</Text>
              </Stack>
            )}
          </>
        ) : (
          <Text>Maybe this squad is empty.</Text>
        )}
      </Stack>
    </Box>
  )
}
