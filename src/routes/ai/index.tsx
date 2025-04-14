import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Stack,
  Text,
  TextInput
} from '@mantine/core'
import { useState } from 'react'
import { GIcon } from '../../components/common/GIcon'
import { useGemini } from '../../hooks/useGemini'
import { useMutation } from '@tanstack/react-query'
import { GToast } from '../../components/common/GToast'
import { MessageBox } from '../../components/ai/MessageBox'

export interface GeminiMessage {
  id: number
  createdAt: Date
  message: string
  isFromGemini: boolean
}

export const Route = createFileRoute('/ai/')({
  component: RouteComponent
})

function RouteComponent() {
  const [prompt, setPrompt] = useState<string>('')
  const [messages, setMessages] = useState<GeminiMessage[]>([])
  const [loadingId, setLoadingId] = useState<number>()

  const { generateText } = useGemini()

  const { mutate: sendPrompt, isPending: isSendingPrompt } = useMutation({
    mutationKey: ['sendPrompt', new Date().toDateString()],
    mutationFn: ({ prompt }: { prompt: string; id?: number }) => {
      return generateText({ prompt })
    },
    onSuccess: (response, variables) => {
      const id = variables.id

      if (id) {
        setMessages((prev) => {
          setLoadingId(id)
          prev[id] = {
            ...prev[id],
            message:
              // @ts-expect-error type
              response.response.candidates[0].content.parts[0].text || '',
            createdAt: new Date()
          }
          setLoadingId(undefined)
          return prev
        })
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: messages.length,
            createdAt: new Date(),
            message:
              // @ts-expect-error type
              response.response.candidates[0].content.parts[0].text || '',
            isFromGemini: true
          }
        ])
        setPrompt('')
      }
    },
    onError: () => {
      GToast.error({
        title: 'Something happen. Please try again!'
      })
      setPrompt(messages[messages.length - 1].message)
      setMessages((prev) => prev.slice(0, prev.length - 2))
    }
  })

  const send = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: messages.length,
        createdAt: new Date(),
        message: prompt,
        isFromGemini: false
      }
    ])
    sendPrompt({ prompt })
  }

  const regenerateMessage = (id: number) => {
    const message = messages.find((m) => m.id === id)
    if (message) {
      setLoadingId(id + 1)
      sendPrompt({ prompt: message.message, id: id + 1 })
    }
  }

  return (
    <AppLayout>
      <Box mx="auto" maw={1000} px={20} pt={10} bg={'white'} mah={'90vh'}>
        <Stack align="center" mt={12}>
          <Group gap={8}>
            <Text className="!text-2xl !font-bold">Chat with AI</Text>
            <ActionIcon
              size="sm"
              onClick={() => setMessages([])}
              variant="subtle"
              disabled={!messages.length}
            >
              <GIcon name="Eraser" size={18} />
            </ActionIcon>
          </Group>
          <Box
            className="relative overflow-hidden rounded-xl border border-indigo-200 shadow-lg transition-all duration-300 hover:shadow-indigo-100/50"
            w="100%"
            h={1000}
          >
            {/* Subtle pulse effect on border */}
            <div className="absolute inset-0 animate-pulse rounded-xl border-2 border-indigo-300/30"></div>

            {messages.length ? (
              <MessageBox
                messages={messages}
                isSendingPrompt={isSendingPrompt}
                setMessages={setMessages}
                regenerateMessage={regenerateMessage}
                loadingId={loadingId}
              />
            ) : (
              <Flex mt={300} justify="center" className="relative z-10">
                <div className="flex flex-col items-center gap-4 rounded-xl bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <GIcon
                    name="Sparkles"
                    size={32}
                    className="text-indigo-500"
                  />
                  <Text className="text-lg font-medium text-gray-700">
                    Enter prompt to start a conversation
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Ask me anything about coding, tech, or general knowledge
                  </Text>
                </div>
              </Flex>
            )}
          </Box>
        </Stack>
        <Group mt={8} pb={24} className="relative">
          <TextInput
            size="md"
            radius="md"
            value={!isSendingPrompt ? prompt : ''}
            color="indigo"
            placeholder="Ask AI something..."
            onChange={(e) => setPrompt(e.currentTarget.value)}
            className="grow rounded-lg transition-all duration-300 focus-within:shadow-md focus-within:shadow-indigo-200/50"
            onKeyDownCapture={(e) => {
              if (e.key === 'Enter' && !isSendingPrompt) {
                send()
              }
            }}
            styles={{
              input: {
                border: '1px solid #e9ecef',
                '&:focus': {
                  borderColor: 'var(--mantine-color-indigo-5)',
                  boxShadow: '0 0 0 2px var(--mantine-color-indigo-1)'
                }
              }
            }}
            rightSection={
              prompt && (
                <ActionIcon
                  color="gray"
                  variant="subtle"
                  onClick={() => setPrompt('')}
                  className="opacity-70 transition-opacity hover:opacity-100"
                >
                  <GIcon name="X" size={16} />
                </ActionIcon>
              )
            }
          />
          <Button
            size="md"
            radius="md"
            rightSection={<GIcon name="Send" size={18} />}
            onClick={() => send()}
            disabled={isSendingPrompt || !prompt}
            className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:shadow-indigo-300/50"
            variant={prompt ? 'filled' : 'light'}
            color="indigo"
          >
            Send
          </Button>
        </Group>
      </Box>
    </AppLayout>
  )
}
