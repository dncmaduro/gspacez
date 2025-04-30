import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import { GenerateTextRequest, SendChatMessageRequest } from './models'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const useGemini = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const generateText = async (req: GenerateTextRequest) => {
    const generativeAi = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY)
    const model = generativeAi.getGenerativeModel({ model: 'gemini-1.5-flash' })

    return await model.generateContent([req.prompt])
  }

  const sendChatMessage = async (req: SendChatMessageRequest) => {
    return callApi<SendChatMessageRequest, any>({
      method: 'POST',
      path: `/v1/profile-service/google-gemini/chat`,
      data: req,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  return { generateText, sendChatMessage }
}
