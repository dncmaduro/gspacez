import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Autocomplete,
  AutocompleteProps,
  Box,
  Group,
  Stack,
  Text,
  Grid,
  Loader,
  Paper,
  Flex
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useGSearch } from '../../hooks/useGSearch'
import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { GPost } from '../../components/common/GPost'
import { GPostSkeleton } from '../../components/common/GPostSkeleton'
import { Helmet } from 'react-helmet-async'
import { IPost } from '../../hooks/interface'

export const Route = createFileRoute('/tags/')({
  component: RouteComponent,
  validateSearch: (search) =>
    search as {
      t?: string
    }
})

interface AutocompleteItem {
  type: 'tag'
  label: string
  value: string
  description: string
  image: string
}

function RouteComponent() {
  const currentSearchTag = useSearch({ from: Route.fullPath }).t
  const [searchText, setSearchText] = useState<string>(currentSearchTag || '')
  const {
    searchTags,
    searchPostsByTag,
    getPopularTags,
    pushSearchHistory,
    getSearchTagsHistory
  } = useGSearch()
  const navigate = useNavigate()
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

  const { data: tagsHistory } = useQuery({
    queryKey: ['get-search-tags-history'],
    queryFn: () => getSearchTagsHistory(),
    select: (data) => {
      return data.data.result
    }
  })

  const {
    data: postsData,
    isLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['search-posts-by-tag', currentSearchTag],
    queryFn: ({ pageParam }) =>
      searchPostsByTag({
        hashTag: currentSearchTag,
        page: pageParam,
        size
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.data.result.number + 1
      return nextPage < lastPage.data.result.totalPages ? nextPage : undefined
    },
    enabled: !!currentSearchTag
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
    if (!searchText) {
      const tags = (tagsHistory || []).map((tag) => ({
        type: 'tag',
        label: tag.content,
        value: tag.content,
        description: `Tag: ${tag.content}`,
        image: 'https://via.placeholder.com/36'
      })) as AutocompleteItem[]

      return {
        data: [
          {
            group: 'Recenly Search Tags',
            items: tags
          }
        ],
        byValues: {
          ...(tags || []).reduce(
            (acc, tag) => {
              return { ...acc, [tag.value]: tag }
            },
            {} as Record<string, AutocompleteItem>
          )
        }
      }
    }
    if (!tagsData) return { data: [], byValues: {} }

    const convertedTags = (tagsData || []).map((tag) => ({
      type: 'tag',
      label: tag,
      value: tag,
      description: `Tag: ${tag}`,
      image: 'https://via.placeholder.com/36'
    })) as AutocompleteItem[]

    return {
      data: [
        {
          group: 'Tags',
          items: convertedTags.map((tag) => tag.value)
        }
      ],
      byValues: convertedTags.reduce(
        (acc, item) => {
          return { ...acc, [item.value]: item }
        },
        {} as Record<string, AutocompleteItem>
      )
    }
  }, [tagsData, tagsHistory])

  const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({
    option
  }) => (
    <Group gap={8}>
      <Stack gap={0}>
        <Text size="sm">{data.byValues[option.value].label}</Text>
      </Stack>
    </Group>
  )

  const { data: popularTags } = useQuery({
    queryKey: ['get-popular-tags'],
    queryFn: () => getPopularTags(),
    select: (data) => {
      return [data.data.result.slice(0, 10), data.data.result.slice(10, 20)]
    }
  })

  const { mutate: push } = useMutation({
    mutationFn: (req: { tag: string }) =>
      pushSearchHistory({ content: req.tag, type: 'TAGS' })
  })

  const NoneSearch = () => {
    return (
      <Paper p={16} shadow="md" radius={'md'} w="100%" maw={600} mx={'auto'}>
        <Text fw={700} size="xl">
          Populars Tags
        </Text>
        <Flex justify="space-between" mx={20} mt={16}>
          <Stack>
            {popularTags?.[0].map((tag) => (
              <Text
                key={tag}
                size="lg"
                className="cursor-pointer hover:underline"
                onClick={() => {
                  push({ tag })
                  navigate({ to: `/tags?t=${tag}` })
                }}
              >
                #{tag}
              </Text>
            ))}
          </Stack>
          <Stack>
            {popularTags?.[1].map((tag) => (
              <Text
                key={tag}
                size="lg"
                className="cursor-pointer hover:underline"
                onClick={() => {
                  push({ tag })
                  navigate({ to: `/tags?t=${tag}` })
                }}
              >
                #{tag}
              </Text>
            ))}
          </Stack>
        </Flex>
      </Paper>
    )
  }

  return (
    <>
      <Helmet>
        <title>
          {currentSearchTag
            ? `#${currentSearchTag} - GspaceZ`
            : 'Tags - GspaceZ'}
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
              limit={20}
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
                    push({ tag: item.value })
                    navigate({ to: `/tags?t=${item.value}` })
                  }
                }
              }}
              data={data.data}
              renderOption={renderAutocompleteOption}
              onOptionSubmit={(value) => {
                const item = data.byValues[value]
                if (item) {
                  push({ tag: item.value })
                  navigate({ to: `/tags?t=${item.value}` })
                }
                return false
              }}
            />
          </Stack>
        </Box>

        <Box px={32} py={24}>
          {!currentSearchTag ? (
            <NoneSearch />
          ) : (
            <>
              <Box mb={16}>
                <Text size="xl" fw={700} className="text-indigo-700">
                  All posts with tag #{currentSearchTag}
                </Text>
              </Box>

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
            </>
          )}
        </Box>
      </AppLayout>
    </>
  )
}
