import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  GetPostsStatsRequest,
  GetPostsStatsResponse,
  GetSquadsStatsRequest,
  GetSquadsStatsResponse,
  GetUsersStatsRequest,
  GetUsersStatsResponse
} from './models'

export const useAdmin = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const getPostsStats = async (req: GetPostsStatsRequest) => {
    return callApi<GetPostsStatsRequest, GetPostsStatsResponse>({
      method: 'POST',
      path: `/v1/post-service/dashboard/post-statistics`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  const getUsersStats = async (req: GetUsersStatsRequest) => {
    return callApi<GetUsersStatsRequest, GetUsersStatsResponse>({
      method: 'POST',
      path: `/v1/profile-service/dashboard/user-statistics`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  const getSquadsStats = async (req: GetSquadsStatsRequest) => {
    return callApi<GetSquadsStatsRequest, GetSquadsStatsResponse>({
      method: 'POST',
      path: `/v1/profile-service/dashboard/squad-statistics`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  return { getPostsStats, getUsersStats, getSquadsStats }
}
