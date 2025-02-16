import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Flex,
  Image,
  Stack,
  Text
} from '@mantine/core'
import { IPost } from '../../hooks/interface'
import { useMemo } from 'react'
import { previewTags } from '../../utils/tags'
import Logo from '../../public/Logo.png'
import { GIcon } from './GIcon'
import { Link } from '@tanstack/react-router'

interface Props {
  post: IPost
}

export const GPost = ({ post }: Props) => {
  const { visibleTags, restTags } = useMemo(
    () => previewTags(post.hashTags),
    [post]
  )

  const previewImage = post.content.imageUrls ? post.content.imageUrls[0] : Logo

  return (
    <Box
      className="w-full cursor-pointer rounded-lg border border-indigo-200 shadow-md hover:border-indigo-400"
      px={24}
      py={16}
    >
      <Link to={`/post/${post.id}`} className="w-full">
        <Stack gap={4}>
          <Avatar src={post.avatarUrl} className="border border-indigo-200" />
          <Text className="!text-xl !font-bold">{post.title}</Text>
          <Box h={40} mt={12}>
            <Flex wrap="wrap" gap={8}>
              {visibleTags.map((tag, index) => (
                <Badge
                  size="sm"
                  variant="outline"
                  color="gray"
                  key={index}
                  style={{ textTransform: 'initial' }}
                >
                  # {tag}
                </Badge>
              ))}
              {restTags > 0 && (
                <Badge size="sm" variant="outline" color="gray">
                  + {restTags}
                </Badge>
              )}
            </Flex>
          </Box>
          <Image
            mt={12}
            mih={200}
            mah={200}
            src={previewImage}
            radius="md"
            className="border border-gray-100"
            fit="cover"
            style={{ objectPosition: 'center' }}
          />
          <Flex justify="space-between" mt={12}>
            <ActionIcon variant="subtle" size="lg" color="gray.9">
              <GIcon name="ThumbUp" size={24} />
            </ActionIcon>
            <ActionIcon variant="subtle" size="lg" color="gray.9">
              <GIcon name="ThumbDown" size={24} />
            </ActionIcon>
            <ActionIcon variant="subtle" size="lg" color="gray.9">
              <GIcon name="Message" size={24} />
            </ActionIcon>
            <ActionIcon variant="subtle" size="lg" color="gray.9">
              <GIcon name="Link" size={24} />
            </ActionIcon>
          </Flex>
        </Stack>
      </Link>
    </Box>
  )
}
