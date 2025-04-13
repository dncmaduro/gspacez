import { Box, Stack, Group, Skeleton, Loader } from '@mantine/core'
import { RefObject } from 'react'
import { GSimplePost } from './GSimplePost'
import { IPost } from '../../hooks/interface'

interface Props {
  posts: IPost[]
  isLoading: boolean
  hasNextPage: boolean
  loaderRef: RefObject<HTMLDivElement>
}

const GProfilePosts = ({ posts, isLoading, hasNextPage, loaderRef }: Props) => {
  return (
    <Box w={700} m={20} className="text-center">
      <Stack gap={24}>
        {isLoading ? (
          <Loader />
        ) : (
          posts.map((post) => <GSimplePost key={post.id} post={post} />)
        )}

        {hasNextPage && (
          <Box
            className="rounded-lg border border-gray-300"
            p={16}
            ref={loaderRef}
          >
            <Group>
              <Skeleton h={44} w={44} radius="xl" />
              <Stack gap={4} align="flex-start">
                <Skeleton h={16} w={120} radius="xl" />
                <Skeleton h={12} w={100} radius="xl" />
              </Stack>
            </Group>
            <Stack mt={32} gap={8} align="center">
              <Stack gap={8}>
                <Skeleton h={16} w={400} radius="xl" />
                <Skeleton h={16} w={200} radius="xl" />
                <Skeleton h={16} w={400} radius="xl" />
              </Stack>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default GProfilePosts
