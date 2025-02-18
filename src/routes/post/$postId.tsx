import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { usePost } from '../../hooks/usePost'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Avatar, Box, Flex, Loader, Text } from '@mantine/core'
import ReactMarkdown from 'react-markdown'

export const Route = createFileRoute('/post/$postId')({
  component: RouteComponent
})

function RouteComponent() {
  const { postId } = useParams({ from: `/post/$postId` })
  const token = useSelector((state: RootState) => state.auth.token)

  const { getPost } = usePost()

  const { data, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => {
      return getPost({ id: postId }, token)
    }
  })

  const postData = data?.data.result

  return (
    <AppLayout>
      <Box
        w={800}
        mx="auto"
        className="rounded-lg border border-gray-200 shadow-sm"
        px={32}
        py={20}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Flex align="center" gap={8}>
              <Avatar src={postData?.avatarUrl} size="sm" />
              <Text className="!text-sm">
                {postData?.profileName || 'Name Name'}
              </Text>
            </Flex>
            <Text className="!text-2xl !font-bold" mt={16}>
              {postData?.title || 'Title'}
            </Text>
            <Box mt={24}>
              <ReactMarkdown>{postData?.content.text || ''}</ReactMarkdown>
            </Box>
          </>
        )}
      </Box>
    </AppLayout>
  )
}
