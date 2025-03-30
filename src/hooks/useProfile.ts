import { callApi } from '../utils/axios'
import {
  GetMeResponse,
  GetProfileResponse,
  JoinedSquadsResponse,
  UpdateMeRequest,
  UpdateMeResponse
} from './models'

export const useProfile = () => {
  const getMe = async (token: string) => {
    return callApi<never, GetMeResponse>({
      token,
      method: 'GET',
      path: `/v1/profile-service/info`
    })
  }

  const updateMe = async (req: UpdateMeRequest, token: string) => {
    return callApi<UpdateMeRequest, UpdateMeResponse>({
      token,
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

  const getJoinedSquads = async (token: string) => {
    return callApi<never, JoinedSquadsResponse>({
      path: `/v1/profile-service/squads/joined`,
      method: 'GET',
      token
    })
  }

  return { getMe, getProfile, updateMe, getJoinedSquads }
}
