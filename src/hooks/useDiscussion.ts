import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  BaseSearchRequest,
  ChangeDiscussionStatusRequest,
  CreateDiscussionCommentRequest,
  CreateDiscussionRequest,
  CreateDiscussionResponse,
  GetDetailDiscussionResponse,
  GetDiscussionCommentsRequest,
  GetDiscussionCommentsResponse,
  SearchDiscussionsResponse,
  UpdateDiscussionRequest,
  UpvoteCommentResponse,
  VotePollRequest
} from './models'

export const useDiscussion = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const createDiscussion = async (req: CreateDiscussionRequest) => {
    return callApi<CreateDiscussionRequest, CreateDiscussionResponse>({
      method: 'POST',
      path: `/v1/post-service/discussions/create`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  const searchDiscussions = async (req: BaseSearchRequest) => {
    return callApi<never, SearchDiscussionsResponse>({
      method: 'GET',
      path: `/v1/post-service/discussions/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getDetailDiscussion = async (id: string) => {
    return callApi<never, GetDetailDiscussionResponse>({
      method: 'GET',
      path: `/v1/post-service/discussions/${id}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const updateDiscussion = async (id: string, req: UpdateDiscussionRequest) => {
    return callApi<UpdateDiscussionRequest, never>({
      method: 'PUT',
      path: `/v1/post-service/discussions/${id}/update`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  const deleteDiscussion = async (id: string) => {
    return callApi<never, never>({
      method: 'DELETE',
      path: `/v1/post-service/discussions/${id}/delete`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const changeDiscussionStatus = async (
    id: string,
    req: ChangeDiscussionStatusRequest
  ) => {
    return callApi<ChangeDiscussionStatusRequest, never>({
      method: 'PATCH',
      path: `/v1/post-service/discussions/${id}/status`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  const createDiscussionComment = async (
    id: string,
    req: CreateDiscussionCommentRequest
  ) => {
    return callApi<CreateDiscussionCommentRequest, never>({
      method: 'POST',
      path: `/v1/post-service/discussions/${id}/comments/create`,
      data: req,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getDiscussionComments = async (
    id: string,
    req: GetDiscussionCommentsRequest
  ) => {
    return callApi<never, GetDiscussionCommentsResponse>({
      method: 'GET',
      path: `/v1/post-service/discussions/${id}/comments?page=${req.page}&size=${req.size}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const votePoll = async (id: string, req: VotePollRequest) => {
    return callApi<VotePollRequest, never>({
      method: 'POST',
      path: `/v1/post-service/discussions/${id}/vote`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  const upvoteComment = async (id: string) => {
    return callApi<never, UpvoteCommentResponse>({
      method: 'PUT',
      path: `/v1/post-service/discussions/comments/${id}/upvote`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  return {
    createDiscussion,
    searchDiscussions,
    getDetailDiscussion,
    updateDiscussion,
    deleteDiscussion,
    changeDiscussionStatus,
    getDiscussionComments,
    votePoll,
    createDiscussionComment,
    upvoteComment
  }
}
