import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  GetFeedbacksRequest,
  GetFeedbacksResponse,
  SendFeedbackRequest,
  SendFeedbackResponse
} from './models'

export const useFeedback = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const sendFeedback = async (req: SendFeedbackRequest) => {
    return callApi<SendFeedbackRequest, SendFeedbackResponse>({
      method: 'POST',
      path: `/v1/profile-service/feedback/create`,
      data: req,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getFeedbacks = async (req: GetFeedbacksRequest) => {
    return callApi<never, GetFeedbacksResponse>({
      method: 'GET',
      path: `/v1/profile-service/feedback/all?page=${req.page}&size=${req.size}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  return { sendFeedback, getFeedbacks }
}
