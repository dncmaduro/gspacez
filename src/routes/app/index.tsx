import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { useEffect, useRef } from 'react'
import { usePost } from '../../hooks/usePost'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Box, Button, Grid, Loader } from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { GPost } from '../../components/common/GPost'
import { GPostSkeleton } from '../../components/common/GPostSkeleton'
import { Helmet } from 'react-helmet-async'
import { GetNewsfeedResponse } from '../../hooks/models'

export const Route = createFileRoute('/app/')({
  component: RouteComponent
})

function RouteComponent() {
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const pageSize = 20

  const { getNewsfeed } = usePost()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['newsfeed'],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await getNewsfeed({ pageNum: pageParam, pageSize })
        return response.data
      },
      getNextPageParam: (
        lastPage: GetNewsfeedResponse,
        allPages: GetNewsfeedResponse[]
      ) => {
        return lastPage.result.content.length === pageSize
          ? allPages.length + 1
          : undefined
      },
      initialPageParam: 1
    })

  const posts = data?.pages.flatMap((page) => page.result.content) || []

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <>
      <Helmet>
        <title>My Feed - GspaceZ</title>
      </Helmet>
      <AppLayout>
        <Box px={32} py={24}>
          <Button
            variant="light"
            radius="md"
            size="md"
            leftSection={<GIcon name="AdjustmentsCode" size={20} />}
          >
            Custom your feed
          </Button>
          {isLoading && !posts.length ? (
            <Box>
              <Loader mt={32} />
            </Box>
          ) : (
            <Grid mt={32} gutter={{ base: 5, md: 24, xl: 32 }}>
              {posts.map((post) => (
                <Grid.Col
                  span={{ base: 12, md: 6, lg: 4, xl: 3 }}
                  key={post.id}
                >
                  <GPost post={post} />
                </Grid.Col>
              ))}
              {hasNextPage &&
                ['a', 'b', 'c', 'd'].map((index) => (
                  <Grid.Col
                    ref={loaderRef}
                    span={{ base: 12, md: 6, lg: 4, xl: 3 }}
                    key={index}
                  >
                    <GPostSkeleton />
                  </Grid.Col>
                ))}
            </Grid>
          )}
        </Box>
      </AppLayout>
    </>
  )
}
