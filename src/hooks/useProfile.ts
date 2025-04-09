import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  GetMeResponse,
  GetProfileResponse,
  JoinedSquadsResponse,
  UpdateMeRequest,
  UpdateMeResponse
} from './models'

export const useProfile = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const getMe = async () => {
    return callApi<never, GetMeResponse>({
      accessToken,
      onClearAuth: clearAuth,
      method: 'GET',
      path: `/v1/profile-service/info`
    })
  }

  const updateMe = async (req: UpdateMeRequest) => {
    return callApi<UpdateMeRequest, UpdateMeResponse>({
      accessToken,
      onClearAuth: clearAuth,
      method: 'PUT',
      path: `/v1/profile-service/info`,
      data: req
    })
  }

  const getProfile = async (id: string) => {
    return callApi<never, GetProfileResponse>({
      path: `/v1/profile-service/info/${id}`,
      method: 'GET'
    })
  }

  const getJoinedSquads = async () => {
    return callApi<never, JoinedSquadsResponse>({
      path: `/v1/profile-service/squads/joined`,
      method: 'GET',
      accessToken,
      onClearAuth: clearAuth
    })
  }

  return { getMe, getProfile, updateMe, getJoinedSquads }
}
