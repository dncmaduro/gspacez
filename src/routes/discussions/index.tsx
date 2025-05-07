import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useDiscussion } from '../../hooks/useDiscussion'
import { useState } from 'react'
import { Box, Loader, Stack, Text, TextInput } from '@mantine/core'
import { GDiscussion } from '../../components/common/GDiscussion'
import { GIcon } from '../../components/common/GIcon'
import { useDebouncedValue } from '@mantine/hooks'

export const Route = createFileRoute('/discussions/')({
  component: RouteComponent
})

function RouteComponent() {
  const [searchText, setSearchText] = useState<string>('')
  const debouncedSearchText = useDebouncedValue(searchText, 300)[0]
  const { searchDiscussions } = useDiscussion()

  const { data: discussionsData, isLoading } = useInfiniteQuery({
    queryKey: ['get-discussions', debouncedSearchText],
    queryFn: ({ pageParam }) =>
      searchDiscussions({
        searchText: debouncedSearchText,
        page: pageParam,
        size: 20
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.result.number + 1 < lastPage.data.result.totalPages
        ? lastPage.data.result.number + 1
        : undefined
    }
  })

  return (
    <AppLayout>
      <Box w="100%" maw={800} mx={'auto'} mt={32}>
        <Text size="xl" fw={700} className="text-center">
          To know what people on GspaceZ are talking about
        </Text>

        <Stack mt={32}>
          <TextInput
            leftSection={<GIcon name="Search" size={20} />}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            placeholder="Search discussions"
            mb={16}
            radius={'md'}
          />

          {isLoading ? (
            <Loader />
          ) : (
            discussionsData?.pages.map((page) =>
              page.data.result.content.map((discussion) => (
                <GDiscussion key={discussion.id} discussion={discussion} />
              ))
            )
          )}
        </Stack>
      </Box>
    </AppLayout>
  )
}
