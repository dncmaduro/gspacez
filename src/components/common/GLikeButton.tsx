import { Button, Flex, Text } from '@mantine/core'
import { GIcon } from './GIcon'

interface Props {
  onClick: () => void
  quantity: number
  isLiked: boolean
}

export const GLikeButton = ({ onClick, quantity, isLiked }: Props) => {
  return (
    <Button
      variant="subtle"
      size={'compact-sm'}
      color={isLiked ? 'blue' : 'gray.9'}
      onClick={onClick}
      styles={{
        root: {
          padding: '0 4px'
        }
      }}
    >
      <Flex gap={2}>
        <GIcon name="ThumbUp" size={20} />
        {quantity > 0 && <Text size="sm">{quantity}</Text>}
      </Flex>
    </Button>
  )
}
