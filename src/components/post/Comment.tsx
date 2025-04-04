import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Group,
  Stack,
  Text
} from '@mantine/core'
import { IComment } from '../../hooks/interface'
import ReactMarkdown from 'react-markdown'
import { GIcon } from '../common/GIcon'
import { useDisclosure } from '@mantine/hooks'
import { Link } from '@tanstack/react-router'
import { convertTime } from '../../utils/convertTime'

interface Props {
  comment: IComment
  children: IComment[]
}

export const Comment = ({ comment, children }: Props) => {
  const [opened, { toggle }] = useDisclosure(false)

  return (
    <Stack gap={12}>
      <Flex align="center" gap={16}>
        <Avatar
          src={comment.profileImageUrl}
          component={Link}
          to={`/profile/${comment.profileId}`}
          size="md"
        />
        <Stack gap={1}>
          <Text component={Link} to={`/profile/${comment.profileId}`}>
            {comment.profileName}
          </Text>
          <Text c="dimmed" size="sm">
            {convertTime(
              new Date(comment.createdAt),
              comment.updatedAt ? new Date(comment.updatedAt) : null
            )}
          </Text>
        </Stack>
      </Flex>

      <ReactMarkdown className="mt-2 px-4">
        {comment.content.text}
      </ReactMarkdown>

      <Group className="mt-4">
        {children.length && (
          <Button
            variant="subtle"
            leftSection={
              <GIcon name={opened ? 'ChevronUp' : 'ChevronDown'} size={12} />
            }
            size="sm"
            className="w-fit"
            color="dimmed"
            p={2}
            onClick={toggle}
          >
            {opened ? 'Hide' : 'Show'} replies
          </Button>
        )}
        <ActionIcon size="md" variant="subtle" color="dimmed">
          <GIcon name="ThumbUp" />
        </ActionIcon>
        <ActionIcon size="md" variant="subtle" color="dimmed">
          <GIcon name="ThumbDown" />
        </ActionIcon>
        <ActionIcon size="md" variant="subtle" color="dimmed">
          <GIcon name="Message" />
        </ActionIcon>
      </Group>

      {opened && <Divider w="100%" my={8} h={3} />}
      <Collapse in={opened} ml={32} mt={8}>
        {children.map((comment) => (
          <Box key={comment.id}>
            <Flex align="center" gap={16}>
              <Avatar src={comment.profileImageUrl} size="md" />
              <Stack gap={1}>
                <Text>{comment.profileName}</Text>
                <Text c="dimmed" size="sm">
                  {convertTime(
                    new Date(comment.createdAt),
                    comment.updatedAt ? new Date(comment.updatedAt) : null
                  )}
                </Text>
              </Stack>
            </Flex>

            <ReactMarkdown className="mt-2 px-4">
              {comment.content.text}
            </ReactMarkdown>

            <Group className="mt-4">
              <ActionIcon size="md" variant="subtle" color="dimmed">
                <GIcon name="ThumbUp" />
              </ActionIcon>
              <ActionIcon size="md" variant="subtle" color="dimmed">
                <GIcon name="ThumbDown" />
              </ActionIcon>
              <ActionIcon size="md" variant="subtle" color="dimmed">
                <GIcon name="Message" />
              </ActionIcon>
            </Group>
          </Box>
        ))}
      </Collapse>
    </Stack>
  )
}
