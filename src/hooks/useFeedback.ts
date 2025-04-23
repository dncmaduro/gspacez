import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import { SendFeedbackRequest, SendFeedbackResponse } from './models'

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

  return { sendFeedback }
}
