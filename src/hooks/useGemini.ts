import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  GetAllChatResponse,
  GetChatHistoryResponse,
  SendChatMessageRequest,
  SendChatMessageResponse
} from './models'

export const useGemini = () => {
  const { accessToken, clearAuth } = useAuthStore()

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

  return { sendChatMessage, getAllChat, getChatHistory }
}
