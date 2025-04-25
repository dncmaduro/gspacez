import { createFileRoute, useSearch } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Autocomplete,
  AutocompleteProps,
  Box,
  Group,
  Stack,
  Text,
  Grid,
  Loader
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useGSearch } from '../../hooks/useGSearch'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { GPost } from '../../components/common/GPost'
import { GPostSkeleton } from '../../components/common/GPostSkeleton'
import { Helmet } from 'react-helmet-async'
import { IPost } from '../../hooks/interface'

export const Route = createFileRoute('/tags/')({
  component: RouteComponent
})

interface AutocompleteItem {
  type: 'tag'
  label: string
  value: string
  description: string
  image: string
}

function RouteComponent() {
  const params = useSearch({ strict: false })
  const [searchText, setSearchText] = useState<string>(params.searchText || '')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { searchTags, searchPostsByTag } = useGSearch()
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const size = 5

  const { data: tagsData } = useQuery({
    queryKey: ['search-tags', searchText],
    queryFn: () => searchTags({ searchText }),
    select: (data) => {
      return data.data.result
    },
    enabled: !!searchText
  })

  useEffect(() => {
    if (!searchText) {
      setSelectedTag(null)
    }
  }, [searchText])

  const {
    data: postsData,
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['search-posts-by-tag', selectedTag],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await searchPostsByTag({
        hashTag: selectedTag!,
        page: pageParam,
        size
      })
      return response
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.data.result.number + 1
      return nextPage < lastPage.data.result.totalPages ? nextPage : undefined
    },
    enabled: !!selectedTag
  })

  const posts: IPost[] = useMemo(() => {
    if (!postsData?.pages) return []
    return postsData.pages.flatMap((page) => page.data.result.content)
  }, [postsData])

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

  const data = useMemo(() => {
    if (!tagsData) return { data: [], byValues: {} }

    const convertedTags = (tagsData || []).map((tag) => ({
      type: 'tag',
      label: tag,
      value: tag,
      description: `Tag: ${tag}`,
      image: 'https://via.placeholder.com/36'
    })) as AutocompleteItem[]

    return {
      data: [{ group: 'Tags', items: convertedTags.map((tag) => tag.value) }],
      byValues: convertedTags.reduce(
        (acc, item) => {
          return { ...acc, [item.value]: item }
        },
        {} as Record<string, AutocompleteItem>
      )
    }
  }, [tagsData])

  const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({
    option
  }) => (
    <Group gap={8}>
      <Stack gap={0}>
        <Text size="sm">{data.byValues[option.value].label}</Text>
      </Stack>
    </Group>
  )

  return (
    <>
      <Helmet>
        <title>
          {selectedTag ? `#${selectedTag} - GspaceZ` : 'Tags - GspaceZ'}
        </title>
      </Helmet>
      <AppLayout hideSearchInput>
        <Box px={32} py={24}>
          <Stack align="center">
            <Autocomplete
              leftSection={<GIcon name="ZoomCode" size={20} color="#4F46E5" />}
              w={400}
              radius="xl"
              placeholder="Search tags"
              onChange={(e) => setSearchText(e)}
              value={searchText}
              className="rounded-full transition-shadow duration-200 focus-within:border-indigo-200/50 hover:shadow-sm"
              styles={{
                input: {
                  border: '1px solid #E5E7EB',
                  height: '42px'
                }
              }}
              onKeyDownCapture={(e) => {
                if (e.key === 'Enter') {
                  const item = data.byValues[searchText]
                  if (item) {
                    setSelectedTag(item.value)
                  }
                }
              }}
              data={data.data}
              renderOption={renderAutocompleteOption}
              onOptionSubmit={(value) => {
                const item = data.byValues[value]
                if (item) {
                  setSelectedTag(item.value)
                }
                return false
              }}
            />
          </Stack>
        </Box>

        <Box px={32} py={24}>
          {selectedTag && (
            <Box mb={16}>
              <Text size="xl" fw={700} className="text-indigo-700">
                All posts with tag #{selectedTag}
              </Text>
            </Box>
          )}

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
