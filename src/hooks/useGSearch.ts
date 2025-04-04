import { callApi } from '../utils/axios'
import {
  BaseSearchRequest,
  SearchPostsResponse,
  SearchSquadsResponse,
  SearchUsersResponse
} from './models'

export const useGSearch = () => {
  const searchUsers = async (req: BaseSearchRequest, token: string) => {
    return callApi<never, SearchUsersResponse>({
      method: 'GET',
      path: `/v1/identity/users/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      token
    })
  }

  const searchPosts = async (req: BaseSearchRequest, token: string) => {
    return callApi<never, SearchPostsResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      token
    })
  }

  const searchSquads = async (req: BaseSearchRequest, token: string) => {
    return callApi<never, SearchSquadsResponse>({
      method: 'GET',
      path: `/v1/profile-service/squads/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      token
    })
  }

  return { searchUsers, searchPosts, searchSquads }
}
