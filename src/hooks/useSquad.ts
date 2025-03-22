import { callApi } from '../utils/axios'
import { CreateSquadRequest, CreateSquadResponse } from './models'

export const useSquad = () => {
  const createSquad = async (req: CreateSquadRequest, token: string) => {
    return callApi<CreateSquadRequest, CreateSquadResponse>({
      method: 'POST',
      path: `/v1/profile-service/squads/create`,
      token,
      data: req
    })
  }

  return { createSquad }
}
