import { Box, ScrollArea, Stack, Text } from '@mantine/core'
import { GeminiMessage } from '../../routes/ai'
import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'

interface Props {
  messages: GeminiMessage[]
  isSendingPrompt: boolean
}

export const MessageBox = ({ messages, isSendingPrompt }: Props) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = scrollAreaRef.current?.children[0] as HTMLDivElement | null
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages.length])

  return (
    <ScrollArea h="100%" px={16} py={8} ref={scrollAreaRef}>
      {messages.map((message, index) => (
        <Stack
          key={index}
          className={` ${message.isFromGemini ? 'self-start' : 'self-end'}`}
          gap={8}
          align={message.isFromGemini ? 'flex-start' : 'flex-end'}
        >
          <Box
            p={16}
            className="rounded-lg"
            w="fit-content"
            maw="80%"
            bg={message.isFromGemini ? 'indigo.1' : 'gray.1'}
          >
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </Box>
          <Text c="dimmed" size="xs">
            {message.createdAt.toLocaleTimeString()}
          </Text>
        </Stack>
      ))}
      {isSendingPrompt && (
        <Box p={16} className="rounded-lg" w="fit-content" bg="indigo.1">
          <Text>Please wait for the answer...</Text>
        </Box>
      )}
    </ScrollArea>
  )
}
