import { createFileRoute, Link } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { usePost } from '../../hooks/usePost'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Box, Button, Group, Skeleton, Stack, Text } from '@mantine/core'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { GSimplePost } from '../../components/common/GSimplePost'
import { useEffect, useRef, useState } from 'react'
import { GIcon } from '../../components/common/GIcon'

export const Route = createFileRoute('/history/')({
  component: RouteComponent
})

function RouteComponent() {
  const { getHistory } = usePost()
  const token = useSelector((state: RootState) => state.auth.token)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState<number>()
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const {
    data: history,
    isLoading,
    refetch: loadMorePosts
  } = useQuery({
    queryKey: ['get-history'],
    queryFn: () => getHistory({ page, size: 20 }, token),
    select: (data) => {
      return data.data.result
    },
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    setTotal(history?.totalPages || 0)
    setPage((prev) => prev + 1)
  }, [history])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (total && firstEntry.isIntersecting && !isLoading && page < total) {
          loadMorePosts()
        }
      },
      { threshold: 1.0 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [isLoading, loadMorePosts])

  return (
    <AppLayout>
      <Box mx="auto" w={800} mt={32} className="text-center">
        <Text className="!text-xl !font-bold" my={16}>
          Your recent posts
        </Text>
        <Stack gap={24}>
          {history?.content.map((post, index) => (
            <GSimplePost key={index} post={post} />
          ))}
          {total && page < total ? (
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
