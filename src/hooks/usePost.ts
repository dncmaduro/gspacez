import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  CreateCommentRequest,
  CreatePostReponse,
  CreatePostRequest,
  GetCommentsReponse,
  GetHistoryRequest,
  GetHistoryResponse,
  GetNewsfeedRequest,
  GetNewsfeedResponse,
  GetPostRequest,
  GetPostResponse,
  ReactPostRequest,
  ReactPostResponse,
  UpdatePostRequest,
  UpdatePostResponse
} from './models'

export const usePost = () => {
  const { accessToken } = useAuthStore()

  const getNewsfeed = async (req: GetNewsfeedRequest) => {
    return callApi<GetNewsfeedRequest, GetNewsfeedResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/newsfeed?pageNum=${req.pageNum}&pageSize=${req.pageSize}`,
      accessToken
    })
  }

  const getPost = async (req: GetPostRequest) => {
    return callApi<GetPostRequest, GetPostResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/${req.id}`,
      accessToken
    })
  }

  const createPost = async (req: CreatePostRequest) => {
    return callApi<CreatePostRequest, CreatePostReponse>({
      method: 'POST',
      path: `/v1/post-service/posts/create`,
      data: req,
      accessToken
    })
  }

  const updatePost = async (id: string, req: UpdatePostRequest) => {
    return callApi<UpdatePostRequest, UpdatePostResponse>({
      method: 'PUT',
      path: `/v1/post-service/posts/update/${id}`,
      data: req,
      accessToken
    })
  }

  const createComment = async (id: string, req: CreateCommentRequest) => {
    return callApi<CreateCommentRequest, CreatePostReponse>({
      method: 'POST',
      path: `/v1/post-service/posts/comment/${id}`,
      data: req,
      accessToken
    })
  }

  const getComments = async (id: string) => {
    return callApi<never, GetCommentsReponse>({
      method: 'GET',
      path: `/v1/post-service/posts/${id}/comment`,
      accessToken
    })
  }

  const reactPost = async (id: string, req: ReactPostRequest) => {
    return callApi<ReactPostRequest, ReactPostResponse>({
      method: 'PATCH',
      path: `/v1/post-service/posts/react/${id}`,
      accessToken,
      data: req
    })
  }

  const getHistory = async (req: GetHistoryRequest) => {
    return callApi<GetHistoryRequest, GetHistoryResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/history?page=${req.page}&size=${req.size}`,
      accessToken
    })
  }

  return {
    getNewsfeed,
    getPost,
    createPost,
    updatePost,
    createComment,
    getComments,
    reactPost,
    getHistory
  }
}
