import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import { GetArticlesResponse } from './models'

export const useExplore = () => {
  const { accessToken } = useAuthStore()

  const getArticles = () => {
    return callApi<never, GetArticlesResponse>({
      method: 'GET',
      path: `/v1/post-service/explore/articles`,
      accessToken
    })
  }

  return { getArticles }
}
