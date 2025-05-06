import { Box, Flex, ScrollArea, Text } from '@mantine/core'
import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { IChatMessage } from '../../hooks/interface'
import { format } from 'date-fns'

interface Props {
  messages: IChatMessage[]
  isSendingPrompt: boolean
  regenerateMessage: (id: string) => void
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
  }, [messages, isSendingPrompt])

  const Content = ({ message }: { message: IChatMessage }) => {
    return (
      <Box
        p={16}
        pb={8}
        className="rounded-lg"
        w="fit-content"
        maw="70%"
        bg={message.role === 'model' ? 'indigo.1' : 'gray.1'}
      >
        <ReactMarkdown>{message.message}</ReactMarkdown>
        <Text c="dimmed" size="xs" mt={8}>
          {format(new Date(message.createdAt), 'PPp')}
        </Text>
      </Box>
    )
  }

  const Message = ({ message }: { message: IChatMessage }) => {
    return (
      <Flex
        direction={message.role === 'model' ? 'row' : 'row-reverse'}
        gap={8}
        align="center"
        mb={32}
      >
        <Content message={message} />
      </Flex>
    )
  }

  return (
    <ScrollArea h="100%" px={16} py={8} ref={scrollAreaRef}>
      {messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}

      {/* Loading indicator for AI response */}
      {isSendingPrompt && (
        <Flex direction="row" gap={8} align="center" mb={32}>
          <Box p={16} className="rounded-lg" w="fit-content" bg="indigo.1">
            <Flex align="center" gap={8}>
              <div className="flex space-x-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 delay-75"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 delay-100"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 delay-150"></div>
              </div>
              <Text>AI is thinking...</Text>
            </Flex>
          </Box>
        </Flex>
      )}
    </ScrollArea>
  )
}
