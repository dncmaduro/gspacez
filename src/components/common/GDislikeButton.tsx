import { Button, Flex, Text } from '@mantine/core'
import { GIcon } from './GIcon'

interface Props {
  onClick: () => void
  quantity: number
  isDisliked: boolean
}

export const GDislikeButton = ({ onClick, quantity, isDisliked }: Props) => {
  return (
    <Button
      variant="subtle"
      size={'compact-sm'}
      color={isDisliked ? 'red' : 'gray.9'}
      onClick={onClick}
      styles={{
        root: {
          padding: '0 4px'
        }
      }}
    >
      <Flex gap={2}>
        <GIcon name="ThumbDown" size={20} />
        {quantity > 0 && <Text size="sm">{quantity}</Text>}
      </Flex>
    </Button>
  )
}
