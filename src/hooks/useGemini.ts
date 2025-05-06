import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  GenerateTextRequest,
  GetAllChatResponse,
  GetChatHistoryResponse,
  SendChatMessageRequest,
  SendChatMessageResponse
} from './models'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const useGemini = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const generateText = async (req: GenerateTextRequest) => {
    const generativeAi = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY)
    const model = generativeAi.getGenerativeModel({ model: 'gemini-1.5-flash' })

    return await model.generateContent([req.prompt])
  }

  const sendChatMessage = async (req: SendChatMessageRequest) => {
    return callApi<SendChatMessageRequest, SendChatMessageResponse>({
      method: 'POST',
      path: `/v1/profile-service/google-gemini/chat`,
      data: req,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getAllChat = async () => {
    return callApi<never, GetAllChatResponse>({
      method: 'GET',
      path: `/v1/profile-service/google-gemini/chat/all`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getChatHistory = async (id: string) => {
    return callApi<never, GetChatHistoryResponse>({
      method: 'GET',
      path: `/v1/profile-service/google-gemini/chat/${id}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  return { generateText, sendChatMessage, getAllChat, getChatHistory }
}
