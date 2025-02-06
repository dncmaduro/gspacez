import { callApi } from '../utils/axios'
import { SignInRequest, SignInResponse } from './models'

export const useAuth = () => {
  const signIn = async (req: SignInRequest) => {
    return callApi<SignInRequest, SignInResponse>({
      data: req,
      path: '/v1/identity/auth/login',
      method: 'POST'
    })
  }

  return { signIn }
}
