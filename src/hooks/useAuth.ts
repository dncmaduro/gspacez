import { callApi } from '../utils/axios'
import {
  IntrospectRequest,
  IntrospectResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
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

  const introspect = async (req: IntrospectRequest) => {
    return callApi<IntrospectRequest, IntrospectResponse>({
      data: req,
      path: '/v1/identity/auth/introspect',
      method: 'POST'
    })
  }

  const refresh = async (req: RefreshTokenRequest) => {
    return callApi<RefreshTokenRequest, RefreshTokenResponse>({
      data: req,
      path: '/v1/identity/auth/refresh',
      method: 'POST'
    })
  }

  return { signIn, signUp, introspect, refresh }
}
