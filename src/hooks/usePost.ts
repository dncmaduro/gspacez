import { callApi } from '../utils/axios'
import { GetNewsfeedRequest, GetNewsfeedResponse } from './models'

export const usePost = () => {
  const getNewsfeed = async (req: GetNewsfeedRequest, token: string) => {
    return callApi<GetNewsfeedRequest, GetNewsfeedResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/newsfeed?pageNum=${req.pageNum}&pageSize=${req.pageSize}`,
      token
    })
  }

  return { getNewsfeed }
}
