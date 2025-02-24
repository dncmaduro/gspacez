import { callApi } from '../utils/axios'
import { GetMeResponse } from './models'

export const useProfile = () => {
  const getMe = async (token: string) => {
    return callApi<never, GetMeResponse>({
      token,
      method: 'GET',
      path: `/v1/profile-service/info`
    })
  }

  return { getMe }
}
