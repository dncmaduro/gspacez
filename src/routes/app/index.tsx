import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePost } from '../../hooks/usePost'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { Box, Button, Grid, Loader } from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { GPost } from '../../components/common/GPost'
import { GPostSkeleton } from '../../components/common/GPostSkeleton'
import { IPost } from '../../hooks/interface'

export const Route = createFileRoute('/app/')({
  component: RouteComponent
})

function RouteComponent() {
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 20
  const token = useSelector((state: RootState) => state.auth.token)
  const [posts, setPosts] = useState<IPost[]>([])
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const { getNewsfeed } = usePost()

  const { data: newsfeedData, isLoading } = useQuery({
    queryKey: ['newsfeed', pageNumber],
    queryFn: () => {
      return getNewsfeed({ pageNum: pageNumber, pageSize }, token)
    }
  })

  useEffect(() => {
    setPosts([...posts, ...(newsfeedData?.data.result || [])])
  }, [newsfeedData])

  const loadMorePosts = useCallback(() => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && !isLoading) {
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
              <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 3 }} key={post.id}>
                <GPost post={post} />
              </Grid.Col>
            ))}
            {['a', 'b', 'c', 'd'].map((index) => (
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
  )
}
