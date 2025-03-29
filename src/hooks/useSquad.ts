import { callApi } from '../utils/axios'
import {
  CreateSquadRequest,
  CreateSquadResponse,
  GetSquadResponse
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

  return { createSquad, getSquad }
}
