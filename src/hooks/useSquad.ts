import { callApi } from '../utils/axios'
import {
  CreateSquadRequest,
  CreateSquadResponse,
  GetSquadResponse,
  JoinSquadRequest,
  LeaveSquadRequest,
  UpdateSquadRequest,
  UpdateSquadResponse
} from './models'

export const useSquad = () => {
  const createSquad = async (req: CreateSquadRequest, token: string) => {
    return callApi<CreateSquadRequest, CreateSquadResponse>({
      method: 'POST',
      path: `/v1/profile-service/squads/create`,
      token,
      data: req
    })
  }

  const getSquad = async (tagName: string, token: string) => {
    return callApi<never, GetSquadResponse>({
      method: 'GET',
      path: `/v1/profile-service/squads/${tagName}/info`,
      token
    })
  }

  const updateSquad = async (
    tagName: string,
    req: UpdateSquadRequest,
    token: string
  ) => {
    return callApi<UpdateSquadRequest, UpdateSquadResponse>({
      method: 'PUT',
      path: `/v1/profile-service/squads/${tagName}/update`,
      token,
      data: req
    })
  }

  const sendRequest = async (req: JoinSquadRequest, token: string) => {
    return callApi<never, never>({
      method: 'POST',
      path: `/v1/profile-service/squads/${req.tagName}/send-request`,
      token
    })
  }

  const leaveSquad = async (req: LeaveSquadRequest, token: string) => {
    return callApi<never, never>({
      method: 'POST',
      path: `/v1/profile-service/squads/${req.tagName}/leave-squad`,
      token
    })
  }

  return { createSquad, getSquad, updateSquad, sendRequest, leaveSquad }
}
