import { callApi } from '../utils/axios'
import { BaseSearchRequest, SearchUsersResponse } from './models'

export const useGSearch = () => {
  const searchUsers = async (req: BaseSearchRequest, token: string) => {
    console.log(req)
    return callApi<never, SearchUsersResponse>({
      method: 'GET',
      path: `/v1/identity/users/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      token
    })
  }

  return { searchUsers }
}
