import { createFileRoute } from '@tanstack/react-router'
import { useExplore } from '../../hooks/useExplore'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Box, Group, Loader, Stack, Text } from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { GExplore } from '../../components/common/GExplore'
import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { GExploreSkeleton } from '../../components/common/GExploreSkeleton'

export const Route = createFileRoute('/explore/')({
  component: RouteComponent
})

function RouteComponent() {
  const { getArticles } = useExplore()
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const size = 20

  const { 
    data: exploreData, 
    fetchNextPage: fetchNextExplorePage, 
    hasNextPage: hasNextExplorePage, 
    isFetchingNextPage: isFetchingNextExplorePage, 
    isLoading: isExploreLoading 
  } = useInfiniteQuery({
      queryKey: ['get-articles'],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await getArticles({ size, page: pageParam })
        return response.data
      },
      getNextPageParam: (lastPage) => {
        return lastPage.result.number + 1 < lastPage.result.totalPages
          ? lastPage.result.number + 1
          : undefined
      },
      initialPageParam: 0
    })

  const articles = exploreData?.pages.flatMap((page) => page.result.content) || []

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasNextExplorePage && !isFetchingNextExplorePage) {
          fetchNextExplorePage()
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
  }, [fetchNextExplorePage, hasNextExplorePage, isFetchingNextExplorePage])

  return (
    <AppLayout>
      <Box mx="auto" maw={1000} px={20} pt={10} bg={'white'} mah={'90vh'}>
        <Stack align="center">
          <Group>
            <GIcon name="Flame" size={16} />
            <Text className="!text-xl !font-bold">
              Explore around the world
            </Text>
          </Group>
          {isExploreLoading && !articles.length ? (
            <Box>
              <Loader mt={32} />
            </Box>
          ) : (
            <>
              {articles.map((article) => (
                <GExplore key={article.url} article={article} />
              ))}

              {hasNextExplorePage &&
                ['a', 'b', 'c', 'd'].map((key) => (
                  <div key={key} ref={key === 'a' ? loaderRef : undefined}>
                    <GExploreSkeleton />
                  </div>
                ))}
            </>
          )}
        </Stack>
      </Box>
    </AppLayout>
  )
}
