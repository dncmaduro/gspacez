import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  BaseSearchRequest,
  SearchPostsResponse,
  SearchSquadsResponse,
  SearchUsersResponse
} from './models'

export const useGSearch = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const searchUsers = async (req: BaseSearchRequest) => {
    return callApi<never, SearchUsersResponse>({
      method: 'GET',
      path: `/v1/identity/users/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const searchPosts = async (req: BaseSearchRequest) => {
    return callApi<never, SearchPostsResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const searchSquads = async (req: BaseSearchRequest) => {
    return callApi<never, SearchSquadsResponse>({
      method: 'GET',
      path: `/v1/profile-service/squads/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  return { searchUsers, searchPosts, searchSquads }
}
