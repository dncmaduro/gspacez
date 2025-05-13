import { useQuery } from '@tanstack/react-query'
import { useGemini } from '../../hooks/useGemini'
import { ActionIcon, Flex, Group, Loader, Stack, Text } from '@mantine/core'
import { GIcon } from '../common/GIcon'

interface SummaryProps {
  content: string
}

export const Summary = ({ content }: SummaryProps) => {
  const { summarizePost } = useGemini()

  const {
    data: summaryData,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['summarize-post', content],
    queryFn: () => summarizePost({ content }),
    select: (data) => {
      return data.data.result.content
    },
    enabled: !!content && content.length > 0,
    staleTime: Infinity,
    refetchOnMount: false
  })

  return (
    <Stack>
      <Flex justify="space-between" align={'center'}>
        <Text fw={500} size="lg">
          Post Summary
        </Text>
        <ActionIcon
          onClick={() => refetch()}
          variant="subtle"
          size="sm"
          disabled={isFetching}
        >
          <GIcon name="Refresh" />
        </ActionIcon>
      </Flex>
      {isFetching ? (
        <Group>
          <Loader />
          <Text>Summarizing...</Text>
        </Group>
      ) : (
        <Text>{summaryData || 'There are no summry for that post'}</Text>
      )}
    </Stack>
  )
}
