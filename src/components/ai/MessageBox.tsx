import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
  Textarea
} from '@mantine/core'
import { GeminiMessage } from '../../routes/ai'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { GIcon } from '../common/GIcon'
import { Controller, useForm } from 'react-hook-form'

interface Props {
  messages: GeminiMessage[]
  isSendingPrompt: boolean
  setMessages: React.Dispatch<React.SetStateAction<GeminiMessage[]>>
  regenerateMessage: (id: number) => void
  loadingId: number | undefined
}

export const MessageBox = ({
  messages,
  isSendingPrompt,
  setMessages,
  regenerateMessage,
  loadingId
}: Props) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [editIds, setEditIds] = useState<number[]>([])

  useEffect(() => {
    console.log(loadingId)
  }, [loadingId])

  useEffect(() => {
    if (!messages.length) {
      setEditIds([])
    }

    const viewport = scrollAreaRef.current?.children[0] as HTMLDivElement | null
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages.length])

  const Content = ({ message }: { message: GeminiMessage }) => {
    if (loadingId === message.id) {
      return (
        <Box
          p={16}
          className="rounded-lg"
          w="fit-content"
          maw="70%"
          bg={message.isFromGemini ? 'indigo.1' : 'gray.1'}
        >
          <Flex align="center" gap={8}>
            <Text>Regenerating answer...</Text>
          </Flex>
        </Box>
      )
    }

    return (
      <Box
        p={16}
        pb={8}
        className="rounded-lg"
        w="fit-content"
        maw="70%"
        bg={message.isFromGemini ? 'indigo.1' : 'gray.1'}
      >
        <ReactMarkdown>{message.message}</ReactMarkdown>
        <Text c="dimmed" size="xs" mt={8}>
          {message.createdAt.toLocaleTimeString()}
        </Text>
      </Box>
    )
  }

  const EditBox = ({ id }: { id: number }) => {
    const formMethods = useForm<GeminiMessage>({
      defaultValues: messages.find((m) => m.id === id)
    })

    const { handleSubmit, control } = formMethods

    const onSubmit = (values: GeminiMessage) => {
      setEditIds((prev) => prev.filter((e) => e !== id))
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === id)
        prev[index] = values
        return prev
      })
      regenerateMessage(values.id)
    }

    const onCancel = () => {
      setEditIds((prev) => prev.filter((e) => e !== id))
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="w-[50%]">
        <Stack gap={8}>
          <Controller
            control={control}
            name="message"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Enter your message"
                radius="md"
              />
            )}
          />
          <Group className="self-end" gap={8} mr={8}>
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
            <Button size="xs" type="submit">
              Send
            </Button>
          </Group>
        </Stack>
      </form>
    )
  }

  const onRegenerate = (id: number) => {
    regenerateMessage(id - 1)
  }

  const Message = ({ message }: { message: GeminiMessage }) => {
    const isEditing = useMemo(() => {
      return editIds.includes(message.id)
    }, [editIds])

    return (
      <Flex
        direction={message.isFromGemini ? 'row' : 'row-reverse'}
        gap={8}
        align="center"
        mb={32}
      >
        {isEditing ? (
          <EditBox id={message.id} />
        ) : (
          <Content message={message} />
        )}
        {!isEditing && (
          <ActionIcon variant="subtle" color="gray">
            <GIcon
              name={message.isFromGemini ? 'Refresh' : 'Pencil'}
              size={16}
              onClick={() => {
                message.isFromGemini
                  ? // eslint-disable-next-line no-unused-expressions
                    onRegenerate(message.id)
                  : setEditIds((prev) => [...prev, message.id])
              }}
            />
          </ActionIcon>
        )}
      </Flex>
    )
  }

  return (
    <ScrollArea h="100%" px={16} py={8} ref={scrollAreaRef}>
      {messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
      {isSendingPrompt && !loadingId && (
        <Box p={16} className="rounded-lg" w="fit-content" bg="indigo.1">
          <Text>Please wait for the answer...</Text>
        </Box>
      )}
    </ScrollArea>
  )
}
