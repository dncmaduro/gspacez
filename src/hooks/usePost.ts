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
  GetPostsByProfileRequest,
  GetPostsByProfileResponse,
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
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getPost = async (req: GetPostRequest) => {
    return callApi<GetPostRequest, GetPostResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/${req.id}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const createPost = async (req: CreatePostRequest) => {
    return callApi<CreatePostRequest, CreatePostReponse>({
      method: 'POST',
      path: `/v1/post-service/posts/create`,
      data: req,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const updatePost = async (id: string, req: UpdatePostRequest) => {
    return callApi<UpdatePostRequest, UpdatePostResponse>({
      method: 'PUT',
      path: `/v1/post-service/posts/update/${id}`,
      data: req,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const createComment = async (id: string, req: CreateCommentRequest) => {
    return callApi<CreateCommentRequest, CreatePostReponse>({
      method: 'POST',
      path: `/v1/post-service/posts/comment/${id}`,
      data: req,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getComments = async (id: string) => {
    return callApi<never, GetCommentsReponse>({
      method: 'GET',
      path: `/v1/post-service/posts/${id}/comment`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const reactPost = async (id: string, req: ReactPostRequest) => {
    return callApi<ReactPostRequest, ReactPostResponse>({
      method: 'PATCH',
      path: `/v1/post-service/posts/react/${id}`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  const getHistory = async (req: GetHistoryRequest) => {
    return callApi<GetHistoryRequest, GetHistoryResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/history?page=${req.page}&size=${req.size}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getPostsByProfile = async (id: string, req: GetPostsByProfileRequest) => {
    return callApi<GetPostsByProfileRequest, GetPostsByProfileResponse>({
      path: `/v1/post-service/posts/own-post/${id}?pageNum=${req.pageNum}&pageSize=${req.pageSize}`,
      method: 'GET',
      accessToken,
      onClearAuth: clearAuth
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
    getHistory,
    getPostsByProfile
  }
}
function clearAuth(): void {
  throw new Error('Function not implemented.')
}
