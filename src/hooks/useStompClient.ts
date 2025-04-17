import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'

type UseStompClientParams<T> = {
  url: string
  token: string
  topic: string
  onMessage?: (msg: T) => void
}

if (typeof window !== 'undefined' && !window.global) {
  window.global = window
}

export function useStompClient<T>({
  url,
  token,
  topic,
  onMessage
}: UseStompClientParams<T>) {
  const [messages, setMessages] = useState<T[]>([])
  const stompClientRef = useRef<Client | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!stompClientRef.current) {
      const stompClient = new Client({
        brokerURL: url,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      })

      stompClientRef.current = stompClient

      stompClient.onConnect = () => {
        if (!subscriptionRef.current && stompClient.connected) {
          subscriptionRef.current = stompClient.subscribe(topic, (message) => {
            const notification = JSON.parse(message.body)

            if (onMessage) onMessage(notification as T)
            setMessages((prevMessages) => [...prevMessages, notification as T])
          })
        }
      }

      stompClient.onStompError = (frame) => {
        console.error('[STOMP] Error:', frame)
      }

      stompClient.activate()
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }

      if (stompClientRef.current?.connected) {
        stompClientRef.current.deactivate()
        stompClientRef.current = null
      }
    }
  }, [url, token])

  useEffect(() => {
    const stompClient = stompClientRef.current
    if (stompClient && stompClient.connected) {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }

      subscriptionRef.current = stompClient.subscribe(topic, (message) => {
        const notification = JSON.parse(message.body)

        if (onMessage) onMessage(notification as T)
        setMessages((prevMessages) => [...prevMessages, notification as T])
      })
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
    }
  }, [topic, onMessage])

  return { messages }
}
