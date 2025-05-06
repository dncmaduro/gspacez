import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import { CreateDiscussionRequest, CreateDiscussionResponse } from './models'

export const useDiscussion = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const createDiscussion = async (req: CreateDiscussionRequest) => {
    return callApi<CreateDiscussionRequest, CreateDiscussionResponse>({
      method: 'POST',
      path: `/v1/post-service/discussions/create`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  return { createDiscussion }
}
