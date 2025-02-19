import { callApi } from '../utils/axios'
import {
  CreatePostReponse,
  CreatePostRequest,
  GetNewsfeedRequest,
  GetNewsfeedResponse,
  GetPostRequest,
  GetPostResponse,
  UpdatePostRequest,
  UpdatePostResponse
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

  const createPost = async (req: CreatePostRequest, token: string) => {
    return callApi<CreatePostRequest, CreatePostReponse>({
      method: 'POST',
      path: `/v1/post-service/posts/create`,
      data: req,
      token
    })
  }

  const updatePost = async (
    id: string,
    req: UpdatePostRequest,
    token: string
  ) => {
    return callApi<UpdatePostRequest, UpdatePostResponse>({
      method: 'PUT',
      path: `/v1/post-service/posts/update/${id}`,
      data: req,
      token
    })
  }

  return { getNewsfeed, getPost, createPost, updatePost }
}
