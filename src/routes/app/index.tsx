import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePost } from '../../hooks/usePost'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import {
  ActionIcon,
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  Grid,
  Group,
  Loader,
  MultiSelect,
  MultiSelectProps,
  NumberInput,
  Stack,
  Text
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { GPost } from '../../components/common/GPost'
import { GPostSkeleton } from '../../components/common/GPostSkeleton'
import { Helmet } from 'react-helmet-async'
import { useDisclosure } from '@mantine/hooks'
import { useSettings } from '../../hooks/useSettings'
import { useProfile } from '../../hooks/useProfile'
import { Controller, useForm } from 'react-hook-form'
import { updateSettingsFields } from '../../utils/settings'
import { FeedSettingsTimeline } from '../../hooks/types'
import { useGSearch } from '../../hooks/useGSearch'
import { ISettings, ISquad } from '../../hooks/interface'

export const Route = createFileRoute('/app/')({
  component: RouteComponent
})

export type FeedSettingsType = {
  hashtags: string[]
  squads: string[]
  ignoreSquads: string[]
  timeline: FeedSettingsTimeline
  likes: number
}

function RouteComponent() {
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const pageSize = 20
  const [opened, { toggle }] = useDisclosure(false)
  const { data: settingsData } = useSettings()
  const { changeSettings } = useProfile()
  const { searchSquads, searchTags } = useGSearch()
  const [squadSearchText, setSquadSearchText] = useState<string>('')
  const [tagsSearchText, setTagsSearchText] = useState<string>('')

  const { getNewsfeed } = usePost()

  const timelineOptions = [
    { value: 'ALL', label: 'No Limit', icon: 'Clock' },
    { value: 'ONE_DAY', label: 'Last 24 Hours', icon: 'Calendar' },
    { value: 'ONE_WEEK', label: 'Last 7 Days', icon: 'CalendarWeek' },
    { value: 'ONE_MONTH', label: 'Last 30 Days', icon: 'CalendarMonth' }
  ]

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['newsfeed'],
      queryFn: async ({ pageParam }) => {
        const response = await getNewsfeed({ pageNum: pageParam, pageSize })
        return response.data
      },
      getNextPageParam: (lastPage) => {
        return lastPage.result.number + 1 < lastPage.result.totalPages
          ? lastPage.result.number + 1
          : undefined
      },
      initialPageParam: 0
    })

  const posts = data?.pages.flatMap((page) => page.result.content) || []

  const { control, handleSubmit, watch, reset } = useForm<FeedSettingsType>({
    defaultValues: {}
  })

  useEffect(() => {
    reset({
      hashtags: settingsData?.feedSettings.hashtags || [],
      squads: settingsData?.feedSettings.squads || [],
      ignoreSquads: settingsData?.feedSettings.ignoreSquads || [],
      timeline:
        settingsData?.feedSettings.timeline ??
        (timelineOptions[0].value as FeedSettingsTimeline),
      likes: settingsData?.feedSettings.likes || 0
    })
  }, [settingsData?.feedSettings])

  const { mutate: updateSettings } = useMutation({
    mutationFn: ({ req }: { req: FeedSettingsType }) => {
      return changeSettings(
        updateSettingsFields('FEED', req, settingsData || ({} as ISettings))
      )
    }
  })

  const { data: squadsData } = useQuery({
    queryKey: ['search-squads', squadSearchText],
    queryFn: () =>
      searchSquads({ searchText: squadSearchText, size: 20, page: 0 }),
    select: (data) => {
      return data.data.result.content
    }
  })

  const squadsSelectData = useMemo(() => {
    return squadsData?.map((squad) => ({
      value: squad.tagName,
      label: squad.name
    }))
  }, [squadsData])

  const squadsByNames = useMemo(() => {
    return squadsData
      ? squadsData.reduce(
          (acc, squad) => {
            return { ...acc, [squad.tagName]: squad }
          },
          {} as Record<string, ISquad>
        )
      : ({} as Record<string, ISquad>)
  }, [squadsData])

  const squadRenderOption: MultiSelectProps['renderOption'] = ({ option }) => {
    if (!squadsByNames[option.value]) return null

    return (
      <Group>
        <Avatar src={squadsByNames[option.value].avatarUrl} />
        <Stack gap={0}>
          <Text>{squadsByNames[option.value].name}</Text>
          <Text size="sm" c={'dimmed'}>
            @{squadsByNames[option.value].tagName}
          </Text>
        </Stack>
      </Group>
    )
  }

  const { data: tagsData } = useQuery({
    queryKey: ['search-tags', tagsSearchText],
    queryFn: () => searchTags({ searchText: tagsSearchText }),
    select: (data) => {
      return data.data.result || []
    }
  })

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

  const pushTags = (currentTags: string[], newTag: string) => {
    if (currentTags.includes(newTag)) {
      return currentTags
    }

    return [...currentTags, newTag]
  }

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
            onClick={toggle}
          >
            Customize your feed
          </Button>

          <Collapse in={opened}>
            <Box
              p={16}
              mt={16}
              className="rounded-lg border border-gray-200 bg-gray-50 bg-white shadow-sm"
            >
              <form
                onSubmit={handleSubmit((values) => {
                  const updatedValues = {
                    ...values,
                    timeline: values.timeline
                  }
                  updateSettings({ req: updatedValues })
                })}
              >
                <Stack gap={24}>
                  <Box>
                    <Text fw={500} mb={8}>
                      Timeline Preference
                    </Text>
                    <Controller
                      control={control}
                      name="timeline"
                      render={({ field }) => (
                        <Box>
                          <Button.Group>
                            {timelineOptions.map((option) => {
                              console.log(watch('timeline'))
                              return (
                                <Button
                                  key={option.value}
                                  variant={
                                    watch('timeline') === option.value
                                      ? 'filled'
                                      : 'light'
                                  }
                                  color="indigo"
                                  radius="md"
                                  onClick={() => field.onChange(option.value)}
                                  leftSection={
                                    <GIcon name={option.icon} size={16} />
                                  }
                                >
                                  {option.label}
                                </Button>
                              )
                            })}
                          </Button.Group>
                        </Box>
                      )}
                    />
                  </Box>

                  <Box>
                    <Text fw={500} mb={8}>
                      Minimum Likes
                    </Text>
                    <Text size="sm" c="dimmed" mb={8}>
                      Only show posts with at least this many likes
                    </Text>
                    <Controller
                      control={control}
                      name="likes"
                      render={({ field }) => (
                        <Box maw={200}>
                          <NumberInput
                            {...field}
                            min={0}
                            className="w-full rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </Box>
                      )}
                    />
                  </Box>

                  <Box>
                    <Text fw={500} mb={8}>
                      Squads
                    </Text>
                    <Text size="sm" c="dimmed" mb={8}>
                      Only show posts from these squads
                    </Text>
                    <Controller
                      control={control}
                      name="squads"
                      render={({ field }) => (
                        <Box>
                          <MultiSelect
                            data={(squadsSelectData || []).filter(
                              (option) => !field.value.includes(option.value)
                            )}
                            {...field}
                            placeholder="Search squads"
                            searchable
                            clearable
                            nothingFoundMessage="No squads found"
                            maxDropdownHeight={280}
                            clearButtonProps={{ size: 'sm' }}
                            onSearchChange={setSquadSearchText}
                            renderOption={squadRenderOption}
                          />
                        </Box>
                      )}
                    />
                  </Box>

                  <Box>
                    <Text fw={500} mb={8}>
                      Hashtags
                    </Text>
                    <Text size="sm" c={'dimmed'} mb={8}>
                      Only show posts with these hashtags
                    </Text>
                    <Controller
                      control={control}
                      name="hashtags"
                      render={({ field }) => {
                        return (
                          <Stack>
                            <Flex gap={8} wrap={'wrap'}>
                              {field.value && field.value.length > 0 && (
                                <Button
                                  size="compact-xs"
                                  radius={'xl'}
                                  color="red"
                                  variant="subtle"
                                  onClick={() => field.onChange([])}
                                >
                                  Clear All Tags
                                </Button>
                              )}
                              {field.value &&
                                field.value.map((tag, index) => (
                                  <Badge
                                    variant="outline"
                                    key={index}
                                    leftSection={
                                      <ActionIcon
                                        variant="subtle"
                                        size={'xs'}
                                        onClick={() =>
                                          field.onChange(
                                            field.value.filter(
                                              (_, i) => i !== index
                                            )
                                          )
                                        }
                                      >
                                        <GIcon name="X" />
                                      </ActionIcon>
                                    }
                                  >
                                    # {tag}
                                  </Badge>
                                ))}
                            </Flex>
                            <Autocomplete
                              leftSection={<GIcon name="Hash" size={16} />}
                              onChange={(e) => setTagsSearchText(e)}
                              value={tagsSearchText}
                              data={(tagsData || []).filter(
                                (option) => !field.value.includes(option)
                              )}
                              onOptionSubmit={(value) => {
                                field.onChange(pushTags(field.value, value))
                                setTagsSearchText('')
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  field.onChange(
                                    pushTags(field.value, tagsSearchText)
                                  )
                                  setTagsSearchText('')
                                }
                              }}
                            />
                          </Stack>
                        )
                      }}
                    />
                  </Box>

                  <Box className="flex justify-end">
                    <Button
                      type="submit"
                      radius="md"
                      color="indigo"
                      leftSection={<GIcon name="DeviceFloppy" size={16} />}
                    >
                      Save Preferences
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Box>
          </Collapse>

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
