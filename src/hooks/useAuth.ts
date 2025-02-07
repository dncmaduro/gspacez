import { callApi } from '../utils/axios'
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse
} from './models'

export const useAuth = () => {
  const signIn = async (req: SignInRequest) => {
    return callApi<SignInRequest, SignInResponse>({
      data: req,
      path: '/v1/identity/auth/login',
      method: 'POST'
    })
  }

  const signUp = async (req: SignUpRequest) => {
    return callApi<SignUpRequest, SignUpResponse>({
      data: req,
      path: '/v1/identity/users/register',
      method: 'POST'
    })
  }

  return { signIn, signUp }
}
