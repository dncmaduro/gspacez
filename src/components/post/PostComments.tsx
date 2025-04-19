import { useParams } from '@tanstack/react-router'
import { usePost } from '../../hooks/usePost'
import { useQuery } from '@tanstack/react-query'
import { Box, Stack } from '@mantine/core'
import { useMemo } from 'react'
import { Comment } from './Comment'

export const PostComments = () => {
  const { postId } = useParams({ from: `/post/$postId` })

  const { getComments } = usePost()

  const { data: commentsData } = useQuery({
    queryKey: ['get-comments', postId],
    queryFn: () => getComments(postId)
  })

  const parentComments = useMemo(() => {
    return (
      commentsData?.data.result.filter((comment) => !comment.parentId) || []
    )
  }, [commentsData])

  return (
    <Stack gap={8}>
      {parentComments.map((comment) => (
        <Box
          className="rounded-lg border border-gray-200 shadow-md"
          key={comment.id}
          p={16}
        >
          <Comment
            comment={comment}
            children={
              commentsData?.data.result.filter(
                (c) => c.parentId === comment.id
              ) || []
            }
            postId={postId}
          />
        </Box>
      ))}
    </Stack>
  )
}
