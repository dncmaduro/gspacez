import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import { GetArticlesRequest, GetArticlesResponse } from './models'

export const useExplore = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const getArticles = (req: GetArticlesRequest) => {
    return callApi<GetArticlesRequest, GetArticlesResponse>({
      method: 'GET',
      path: `/v1/post-service/explore/articles?size=${req.size}&page=${req.page}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  return { getArticles }
}
