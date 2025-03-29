import { ActionIcon } from '@mantine/core'
import { GIcon } from './GIcon'
import { Link } from '@tanstack/react-router'

interface Props {
  postId: string
}

export const GCommentButton = ({ postId }: Props) => {
  const postLink = `/post/${postId}?comment=true`

  return (
    <ActionIcon
      variant="subtle"
      size="lg"
      color="gray.9"
      component={Link}
      to={postLink}
    >
      <GIcon name="Message" size={20} />
    </ActionIcon>
  )
}
