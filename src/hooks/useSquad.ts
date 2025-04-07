import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  CancelJoinRequest,
  CreateSquadRequest,
  CreateSquadResponse,
  GetPendingRequestsRequest,
  GetPendingRequestsResponse,
  GetSquadResponse,
  JoinSquadRequest,
  LastAccessResponse,
  LeaveSquadRequest,
  RejectRequestsRequest,
  UpdateSquadRequest,
  UpdateSquadResponse
} from './models'

export const useSquad = () => {
  const { accessToken } = useAuthStore()

  const createSquad = async (req: CreateSquadRequest) => {
    return callApi<CreateSquadRequest, CreateSquadResponse>({
      method: 'POST',
      path: `/v1/profile-service/squads/create`,
      accessToken,
      data: req
    })
  }

  const getSquad = async (tagName: string) => {
    return callApi<never, GetSquadResponse>({
      method: 'GET',
      path: `/v1/profile-service/squads/${tagName}/info`,
      accessToken
    })
  }

  const updateSquad = async (tagName: string, req: UpdateSquadRequest) => {
    return callApi<UpdateSquadRequest, UpdateSquadResponse>({
      method: 'PUT',
      path: `/v1/profile-service/squads/${tagName}/update`,
      accessToken,
      data: req
    })
  }

  const sendRequest = async (req: JoinSquadRequest) => {
    return callApi<never, never>({
      method: 'POST',
      path: `/v1/profile-service/squads/${req.tagName}/send-request`,
      accessToken
    })
  }

  const leaveSquad = async (req: LeaveSquadRequest) => {
    return callApi<never, never>({
      method: 'POST',
      path: `/v1/profile-service/squads/${req.tagName}/leave-squad`,
      accessToken
    })
  }

  const cancelRequest = async (req: CancelJoinRequest) => {
    return callApi<never, never>({
      method: 'POST',
      path: `/v1/profile-service/squads/${req.tagName}/cancel-request`,
      accessToken
    })
  }

  const getLastAccessSquads = async () => {
    return callApi<never, LastAccessResponse>({
      method: 'GET',
      path: `/v1/profile-service/squads/squad-access`,
      accessToken
    })
  }

  const getPendingRequests = async (req: GetPendingRequestsRequest) => {
    return callApi<never, GetPendingRequestsResponse>({
      method: 'GET',
      path: `/v1/profile-service/squads/${req.tagName}/pending-members`,
      accessToken
    })
  }

  const rejectRequest = async (tagName: string, req: RejectRequestsRequest) => {
    return callApi<RejectRequestsRequest, never>({
      method: 'POST',
      path: `/v1/profile-service/squads/${tagName}/reject-request`,
      accessToken,
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
      data: req
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
    approveRequest
  }
}
