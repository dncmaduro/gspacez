import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  ChangeSettingsRequest,
  GetLatestPostedSquads,
  GetMeResponse,
  GetProfileResponse,
  GetSettingsResponse,
  GetStreakResponse,
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

  const getJoinedSquads = async (id: string) => {
    return callApi<never, JoinedSquadsResponse>({
      path: `/v1/profile-service/squads/joined/${id}`,
      method: 'GET',
      accessToken,
      onClearAuth: clearAuth
    })
  }
  const getStreak = async (profileTag: string) => {
    return callApi<never, GetStreakResponse>({
      path: `/v1/profile-service/info/${profileTag}/streak`,
      method: 'GET',
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const lastPostedSquads = async (id: string) => {
    return callApi<never, GetLatestPostedSquads>({
      path: `/v1/profile-service/squads/recently-posted/by/${id}`,
      method: 'GET',
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getSettings = async () => {
    return callApi<never, GetSettingsResponse>({
      path: `/v1/profile-service/info/settings`,
      method: 'GET',
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const changeSettings = async (req: ChangeSettingsRequest) => {
    return callApi<ChangeSettingsRequest, never>({
      path: `/v1/profile-service/info/settings/create`,
      method: 'POST',
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  return {
    getMe,
    getProfile,
    updateMe,
    getJoinedSquads,
    getStreak,
    lastPostedSquads,
    getSettings,
    changeSettings
  }
}
