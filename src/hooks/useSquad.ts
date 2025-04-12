import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  CancelJoinRequest,
  CreateSquadRequest,
  CreateSquadResponse,
  GetMembersRequest,
  GetMembersResponse,
  GetPendingRequestsRequest,
  GetPendingRequestsResponse,
  GetSquadPostsRequest,
  GetSquadPostsResponse,
  GetSquadResponse,
  JoinSquadRequest,
  LastAccessResponse,
  LeaveSquadRequest,
  RejectRequestsRequest,
  UpdateRoleRequest,
  UpdateSquadRequest,
  UpdateSquadResponse
} from './models'

export const useSquad = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const createSquad = async (req: CreateSquadRequest) => {
    return callApi<CreateSquadRequest, CreateSquadResponse>({
      method: 'POST',
      path: `/v1/profile-service/squads/create`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  const getSquad = async (tagName: string) => {
    return callApi<never, GetSquadResponse>({
      method: 'GET',
      path: `/v1/profile-service/squads/${tagName}/info`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const updateSquad = async (tagName: string, req: UpdateSquadRequest) => {
    return callApi<UpdateSquadRequest, UpdateSquadResponse>({
      method: 'PUT',
      path: `/v1/profile-service/squads/${tagName}/update`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  const sendRequest = async (req: JoinSquadRequest) => {
    return callApi<never, never>({
      method: 'POST',
      path: `/v1/profile-service/squads/${req.tagName}/send-request`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const leaveSquad = async (req: LeaveSquadRequest) => {
    return callApi<never, never>({
      method: 'POST',
      path: `/v1/profile-service/squads/${req.tagName}/leave-squad`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const cancelRequest = async (req: CancelJoinRequest) => {
    return callApi<never, never>({
      method: 'POST',
      path: `/v1/profile-service/squads/${req.tagName}/cancel-request`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getLastAccessSquads = async () => {
    return callApi<never, LastAccessResponse>({
      method: 'GET',
      path: `/v1/profile-service/squads/squad-access`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getPendingRequests = async (req: GetPendingRequestsRequest) => {
    return callApi<never, GetPendingRequestsResponse>({
      method: 'GET',
      path: `/v1/profile-service/squads/${req.tagName}/pending-members`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const rejectRequest = async (tagName: string, req: RejectRequestsRequest) => {
    return callApi<RejectRequestsRequest, never>({
      method: 'POST',
      path: `/v1/profile-service/squads/${tagName}/reject-request`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  const approveRequest = async (
    tagName: string,
    req: RejectRequestsRequest
  ) => {
    return callApi<RejectRequestsRequest, never>({
      method: 'POST',
      path: `/v1/profile-service/squads/${tagName}/approve-request`,
      accessToken,
      onClearAuth: clearAuth,
      data: req
    })
  }

  const getMembers = async (req: GetMembersRequest) => {
    return callApi<never, GetMembersResponse>({
      method: 'GET',
      path: `/v1/profile-service/squads/${req.tagName}/official-members`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const updateRole = async (tagName: string, req: UpdateRoleRequest) => {
    return callApi<UpdateRoleRequest, never>({
      method: 'PUT',
      data: req,
      path: `/v1/profile-service/squads/${tagName}/update-member-role`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getSquadPosts = async (tagName: string, req: GetSquadPostsRequest) => {
    return callApi<never, GetSquadPostsResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/squad/${tagName}/accepted?page=${req.page}&size=${req.size}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  return {
    createSquad,
    getSquad,
    updateSquad,
    sendRequest,
    leaveSquad,
    cancelRequest,
    getLastAccessSquads,
    getPendingRequests,
    rejectRequest,
    approveRequest,
    getMembers,
    updateRole,
    getSquadPosts
  }
}
