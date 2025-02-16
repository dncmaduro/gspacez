import { callApi } from '../utils/axios'
import {
  GetNewsfeedRequest,
  GetNewsfeedResponse,
  GetPostRequest,
  GetPostResponse
} from './models'

export const usePost = () => {
  const getNewsfeed = async (req: GetNewsfeedRequest, token: string) => {
    return callApi<GetNewsfeedRequest, GetNewsfeedResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/newsfeed?pageNum=${req.pageNum}&pageSize=${req.pageSize}`,
      token
    })
  }

  const getPost = async (req: GetPostRequest, token: string) => {
    return callApi<GetPostRequest, GetPostResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/${req.id}`,
      token
    })
  }

  return { getNewsfeed, getPost }
}
