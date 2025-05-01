import { createFileRoute, Link } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { usePost } from '../../hooks/usePost'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Box, Button, Group, Skeleton, Stack, Text } from '@mantine/core'
import { GSimplePost } from '../../components/common/GSimplePost'
import { useEffect, useRef } from 'react'
import { GIcon } from '../../components/common/GIcon'

export const Route = createFileRoute('/history/')({
  component: RouteComponent
})

function RouteComponent() {
  const { getHistory } = usePost()
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const {
    data: history,
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['get-history'],
    queryFn: async ({ pageParam }) => {
      const response = await getHistory({ page: pageParam, size: 20 })
      return response.data.result
    },
    select: (data) => {
      return data.pages.map((page) => page.content).flat()
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pageable.pageNumber + 1
      return nextPage < lastPage.totalPages ? nextPage : undefined
    },
    initialPageParam: 0
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
    <AppLayout>
      <Box mx="auto" w={800} maw={'100%'} mt={32} className="text-center">
        <Text className="!text-xl !font-bold" my={16}>
          Your recent posts
        </Text>
        <Stack gap={24}>
          {history?.map((post, index) => (
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
              <Text>There are all of your recent pages.</Text>
              <Button
                w="fit-content"
                variant="subtle"
                leftSection={<GIcon name="Search" />}
                component={Link}
                to="/app"
              >
                Explore more?
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>
    </AppLayout>
  )
}
