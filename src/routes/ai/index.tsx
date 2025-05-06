import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  Drawer,
  Title,
  ScrollArea,
  Divider,
  Paper,
  Tooltip
} from '@mantine/core'
import { useState } from 'react'
import { GIcon } from '../../components/common/GIcon'
import { useGemini } from '../../hooks/useGemini'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GToast } from '../../components/common/GToast'
import { MessageBox } from '../../components/ai/MessageBox'
import { SendChatMessageRequest } from '../../hooks/models'
import { v4 as uuidv4 } from 'uuid'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IChatMessage } from '../../hooks/interface'

export const Route = createFileRoute('/ai/')({
  component: RouteComponent,
  validateSearch: (search) =>
    search as {
      s?: string
    }
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const sessionId = useSearch({ from: Route.fullPath }).s
  const [message, setMessage] = useState<string>('')
  const navigate = useNavigate()
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { sendChatMessage, getAllChat, getChatHistory } = useGemini()

  const { data: allChatSessions, isLoading: isLoadingChats } = useQuery({
    queryKey: ['get-all-chat'],
    queryFn: () => getAllChat(),
    select: (data) => {
      return data.data.result
    }
  })

  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['get-chat-history', sessionId],
    queryFn: () => getChatHistory(sessionId!),
    select: (data) => {
      return data.data.result.messages
    },
    enabled: !!sessionId
  })

  const { mutate: sendPrompt, isPending: isSendingPrompt } = useMutation({
    mutationKey: ['send-chat', new Date().toDateString()],
    mutationFn: (req: SendChatMessageRequest) => {
      return sendChatMessage(req)
    },
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ['get-chat-history', newMessage.sessionId]
      })

      const previousMessages = queryClient.getQueryData([
        'get-chat-history',
        newMessage.sessionId
      ])

      if (previousMessages) {
        queryClient.setQueryData(
          ['get-chat-history', newMessage.sessionId],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (old: any) => {
            const newUserMessage: IChatMessage = {
              id: uuidv4(),
              message: newMessage.content,
              role: 'user',
              createdAt: new Date().toISOString(),
              sessionId: newMessage.sessionId
            }

            return {
              ...old,
              data: {
                ...old.data,
                result: {
                  ...old.data.result,
                  messages: [...old.data.result.messages, newUserMessage]
                }
              }
            }
          }
        )
      } else if (newMessage.sessionId) {
        queryClient.setQueryData(['get-chat-history', newMessage.sessionId], {
          data: {
            result: {
              messages: [
                {
                  id: uuidv4(),
                  message: newMessage.content,
                  role: 'user',
                  createdAt: new Date().toISOString(),
                  sessionId: newMessage.sessionId
                }
              ]
            }
          }
        })
      }

      return { previousMessages }
    },
    onSuccess: (response) => {
      if (!sessionId) {
        navigate({ to: `/ai/?s=${response.data.result.sessionId}` })
      }
      setMessage('')
      queryClient.invalidateQueries({
        queryKey: [
          'get-chat-history',
          sessionId || response.data.result.sessionId
        ]
      })
      queryClient.invalidateQueries({
        queryKey: ['get-all-chat']
      })
    },
    onError: (_, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ['get-chat-history', newMessage.sessionId],
          context.previousMessages
        )
      }
      GToast.error({
        title: 'Something happen. Please try again!'
      })
    }
  })

  const handleSessionChange = (newSessionId: string) => {
    if (newSessionId) {
      navigate({ to: `/ai/?s=${newSessionId}` })
      if (isMobile) {
        closeDrawer()
      }
    }
  }

  const send = () => {
    if (!message.trim()) return
    const newSessionId = sessionId ?? uuidv4().replace(/-/g, '').slice(0, 16)

    if (!sessionId) {
      navigate({ to: `/ai/?s=${newSessionId}` })
    }

    sendPrompt({
      content: message,
      sessionId: newSessionId
    })
  }

  const regenerateMessage = (id: string) => {
    const message = chatHistory?.find((m) => m.id === id)
    if (message && message.role === 'user') {
      sendPrompt({ content: message.message, sessionId: sessionId! })
    }
  }

  const createNewChat = () => {
    navigate({ to: '/ai/' })
    queryClient.invalidateQueries({ queryKey: ['get-all-chat'] })
    if (isMobile) {
      closeDrawer()
    }
  }

  const ChatHistorySidebar = () => (
    <Box p="md" w="100%" h="100%">
      <Stack h="100%">
        <Group justify="apart" mb="xs">
          <Title order={4} className="text-indigo-800">
            Chat History
          </Title>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={isMobile ? closeDrawer : undefined}
          >
            {isMobile && <GIcon name="X" size={18} />}
          </ActionIcon>
        </Group>

        <Button
          variant="light"
          color="indigo"
          fullWidth
          leftSection={<GIcon name="Plus" size={16} />}
          onClick={createNewChat}
          className="transition-all duration-200 hover:shadow-md"
        >
          New Chat
        </Button>

        <Divider my="sm" />

        <ScrollArea
          h={isMobile ? 'calc(100vh - 180px)' : 'calc(100vh - 220px)'}
          offsetScrollbars
        >
          <Stack gap="xs">
            {isLoadingChats ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <Paper
                    key={i}
                    p="md"
                    withBorder
                    className="animate-pulse bg-indigo-50/50"
                  >
                    <Stack>
                      <div className="h-4 w-3/4 rounded bg-indigo-100"></div>
                      <div className="h-3 w-1/2 rounded bg-indigo-100/70"></div>
                    </Stack>
                  </Paper>
                ))
            ) : allChatSessions && allChatSessions.length > 0 ? (
              allChatSessions.map((session) => (
                <Paper
                  key={session.sessionId}
                  p="xs"
                  withBorder
                  className={`cursor-pointer transition-all duration-200 hover:border-indigo-300 hover:shadow-sm ${
                    sessionId === session.sessionId
                      ? 'border-indigo-500 bg-indigo-50/50'
                      : ''
                  }`}
                  onClick={() => handleSessionChange(session.sessionId)}
                >
                  <Stack gap={4}>
                    <Group justify="apart">
                      <Text
                        fw={600}
                        size="sm"
                        className="line-clamp-1 text-indigo-900"
                      >
                        {session.nameChatSession ||
                          `Chat ${session.sessionId.slice(0, 8)}`}
                      </Text>
                    </Group>
                  </Stack>
                </Paper>
              ))
            ) : (
              <Flex direction="column" align="center" mt={50}>
                <GIcon name="History" size={32} className="text-indigo-300" />
                <Text color="dimmed" size="sm" mt={8}>
                  No chat history yet
                </Text>
              </Flex>
            )}
          </Stack>
        </ScrollArea>
      </Stack>
    </Box>
  )

  return (
    <AppLayout>
      <Flex h="calc(100vh - 120px)" className="overflow-hidden">
        {/* Chat History Sidebar - Desktop */}
        {!isMobile && (
          <Box
            w={300}
            className="border-r border-indigo-100 bg-white shadow-md transition-all duration-300"
          >
            <ChatHistorySidebar />
          </Box>
        )}

        {/* Mobile Drawer */}
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          title=""
          padding={0}
          size="80%"
          position="left"
          classNames={{
            body: 'p-0'
          }}
        >
          <ChatHistorySidebar />
        </Drawer>

        {/* Main Chat Area */}
        <Box flex={1} className="overflow-hidden">
          <Box
            mx="auto"
            px={20}
            pt={10}
            bg="white"
            h="100%"
            className="flex flex-col"
          >
            <Group justify="apart" py={12}>
              <Group>
                {isMobile && (
                  <ActionIcon
                    variant="subtle"
                    color="indigo"
                    onClick={openDrawer}
                    size="lg"
                  >
                    <GIcon name="Menu" size={20} />
                  </ActionIcon>
                )}
                <Text className="!text-2xl !font-bold">
                  {sessionId && allChatSessions
                    ? allChatSessions.find(
                        (session) => session.sessionId === sessionId
                      )?.nameChatSession || `Chat ${sessionId.slice(0, 8)}`
                    : 'Chat with AI'}
                </Text>
              </Group>

              <Group gap={8}>
                <Tooltip label="New chat">
                  <ActionIcon
                    size="lg"
                    onClick={createNewChat}
                    variant="light"
                    color="indigo"
                    radius="xl"
                    className="transition-transform duration-200 hover:scale-105"
                  >
                    <GIcon name="Plus" size={20} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            <Box className="relative flex-1 overflow-hidden rounded-xl border border-indigo-200 shadow-lg transition-all duration-300 hover:shadow-indigo-100/50">
              <div className="absolute inset-0 animate-pulse rounded-xl border-2 border-indigo-300/30"></div>

              {chatHistory && chatHistory.length > 0 ? (
                <MessageBox
                  messages={chatHistory}
                  isSendingPrompt={isSendingPrompt}
                  regenerateMessage={regenerateMessage}
                />
              ) : isLoadingHistory ? (
                <Flex
                  justify="center"
                  align="center"
                  h="100%"
                  className="relative z-10"
                >
                  <Stack align="center" gap={8}>
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500"></div>
                    <Text>Loading conversation...</Text>
                  </Stack>
                </Flex>
              ) : (
                <Flex
                  justify="center"
                  align="center"
                  h="100%"
                  className="relative z-10"
                >
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

            <Group mt={12} pb={16} className="relative">
              <TextInput
                size="md"
                radius="md"
                value={!isSendingPrompt ? message : ''}
                color="indigo"
                placeholder="Ask AI something..."
                onChange={(e) => setMessage(e.currentTarget.value)}
                className="grow rounded-lg transition-all duration-300 focus-within:shadow-md focus-within:shadow-indigo-200/50"
                onKeyDownCapture={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isSendingPrompt) {
                    e.preventDefault()
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
                  message && (
                    <ActionIcon
                      color="gray"
                      variant="subtle"
                      onClick={() => setMessage('')}
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
                onClick={send}
                disabled={isSendingPrompt || !message.trim()}
                className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:shadow-indigo-300/50"
                variant={message ? 'filled' : 'light'}
                color="indigo"
              >
                Send
              </Button>
            </Group>
          </Box>
        </Box>
      </Flex>
    </AppLayout>
  )
}
