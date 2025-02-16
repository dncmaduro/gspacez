import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { usePost } from '../../hooks/usePost'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Avatar, Box, Flex, Loader, Text } from '@mantine/core'
import { GPostParagraph } from '../../components/common/GPostParagraph'
import { GPostCarousel } from '../../components/common/GPostCarousel'
import { useMemo } from 'react'
import { GMediaProps } from '../../components/common/GMedia'

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

  const medias = useMemo(() => {
    return [
      ...((postData?.content.imageUrls || []).map((image) => ({
        src: image,
        type: 'image'
      })) as GMediaProps[]),
      ...((postData?.content.videoUrls || []).map((video) => ({
        src: video,
        type: 'video'
      })) as GMediaProps[])
    ]
  }, [postData])

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
              <Avatar src={postData?.avatarUrl} />
              <Text>{postData?.profileName || 'Name Name'}</Text>
            </Flex>
            <Text className="!text-2xl !font-bold" mt={16}>
              {postData?.title || 'Title'}
            </Text>
            <Box mt={24}>
              <GPostParagraph content={postData?.content.text || ''} />
            </Box>
            <Box mt={24}>
              <GPostCarousel medias={medias} />
            </Box>
          </>
        )}
      </Box>
    </AppLayout>
  )
}
