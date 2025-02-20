import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useParams,
  useRouter
} from '@tanstack/react-router'
import { usePost } from '../../hooks/usePost'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Loader,
  Text
} from '@mantine/core'
import ReactMarkdown from 'react-markdown'
import { GIcon } from '../../components/common/GIcon'
import { ReactNode } from 'react'

export const Route = createFileRoute('/post/$postId')({
  component: RouteComponent
})

function RouteComponent() {
  const { postId } = useParams({ from: `/post/$postId` })
  const token = useSelector((state: RootState) => state.auth.token)
  const router = useRouter()

  const { getPost } = usePost()

  const { data, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => {
      return getPost({ id: postId }, token)
    }
  })

  const postData = data?.data.result

  const privacyIcons: Record<string, ReactNode> = {
    PUBLIC: <GIcon name="World" size={16} color="gray" />,
    PRIVATE: <GIcon name="LockFilled" size={16} color="gray" />
  }

  return (
    <AppLayout>
      <Box mx="auto" px={12}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <ActionIcon
              variant="subtle"
              onClick={() => router.history.go(-1)}
              size="md"
            >
              <GIcon name="ArrowLeft" size={20} />
            </ActionIcon>
            <Group justify="space-between" mt={16}>
              <Flex align="center" gap={8}>
                <Avatar src={postData?.avatarUrl} size="md" />
                <Text className="!text-lg">
                  {postData?.profileName || 'Name Name'}
                </Text>
                <GIcon name="PointFilled" size={8} color="gray" />
                <span>{privacyIcons[postData?.privacy || 'PUBLIC']}</span>
              </Flex>
              <Button
                component={Link}
                to={`/post/edit/${postId}`}
                variant="outline"
                leftSection={<GIcon name="Pencil" size={18} />}
              >
                Edit post
              </Button>
            </Group>
            <Text className="!text-2xl !font-bold" mt={16}>
              {postData?.title || 'Title'}
            </Text>
            <Box
              mt={14}
              className="rounded-lg border border-gray-200 shadow-sm"
              px={16}
              py={20}
            >
              <ReactMarkdown>{postData?.content.text || ''}</ReactMarkdown>
            </Box>
          </>
        )}
      </Box>
    </AppLayout>
  )
}
