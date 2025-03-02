import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Box, Button, Flex, Group, Stack, Text, TextInput } from '@mantine/core'
import { useState } from 'react'
import { GIcon } from '../../components/common/GIcon'
import { useGemini } from '../../hooks/useGemini'
import { useMutation } from '@tanstack/react-query'
import { GToast } from '../../components/common/GToast'
import { MessageBox } from '../../components/ai/MessageBox'

export interface GeminiMessage {
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

  const { generateText } = useGemini()

  const { mutate: sendPrompt, isPending: isSendingPrompt } = useMutation({
    mutationKey: ['sendPrompt', new Date().toDateString()],
    mutationFn: () => {
      return generateText({ prompt })
    },
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        {
          createdAt: new Date(),
          // @ts-expect-error type
          message: response.response.candidates[0].content.parts[0].text || '',
          isFromGemini: true
        }
      ])
      setPrompt('')
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
        createdAt: new Date(),
        message: prompt,
        isFromGemini: false
      }
    ])
    sendPrompt()
  }

  return (
    <AppLayout>
      <Box mx="auto" maw={1000}>
        <Stack align="center" mt={12}>
          <Text className="!text-2xl !font-bold">Chat with AI</Text>
          <Box
            className="rounded-xl border border-indigo-200"
            w="100%"
            h={1000}
          >
            {messages.length ? (
              <MessageBox
                messages={messages}
                isSendingPrompt={isSendingPrompt}
              />
            ) : (
              <Flex mt={300} justify="center">
                Enter prompt to start a conversation
              </Flex>
            )}
          </Box>
        </Stack>
        <Group mt={8}>
          <TextInput
            size="md"
            radius="md"
            value={!isSendingPrompt ? prompt : ''}
            color="indigo"
            placeholder="Ask AI something..."
            onChange={(e) => setPrompt(e.currentTarget.value)}
            className="grow"
            onKeyDownCapture={(e) => {
              if (e.key === 'Enter' && !isSendingPrompt) {
                send()
              }
            }}
          />
          <Button
            size="md"
            radius="md"
            rightSection={<GIcon name="Send" size={18} />}
            onClick={() => send()}
            disabled={isSendingPrompt || !prompt}
          >
            Send
          </Button>
        </Group>
      </Box>
    </AppLayout>
  )
}
