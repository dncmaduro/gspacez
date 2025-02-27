import { callApi } from '../utils/axios'
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  IntrospectRequest,
  IntrospectResponse,
  LoginByGoogleResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyOtpRequest
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

  const loginWithGoogle = async (code: string) => {
    return callApi<never, LoginByGoogleResponse>({
      path: `/v1/identity/auth/oauth2?code=${code}`,
      method: 'POST'
    })
  }

  const forgotPassword = async (req: ForgotPasswordRequest) => {
    return callApi<ForgotPasswordRequest, ForgotPasswordResponse>({
      path: `/v1/identity/auth/forget-password`,
      method: 'POST',
      data: req
    })
  }

  const verifyOtp = async (req: VerifyOtpRequest) => {
    return callApi<VerifyOtpRequest, never>({
      path: `/v1/identity/auth/verify-otp`,
      method: 'POST',
      data: req
    })
  }

  const resetPassword = async (req: ResetPasswordRequest) => {
    return callApi<ResetPasswordRequest, never>({
      path: `/v1/identity/auth/reset-password`,
      method: 'POST',
      data: req
    })
  }

  return {
    signIn,
    signUp,
    introspect,
    refresh,
    loginWithGoogle,
    forgotPassword,
    verifyOtp,
    resetPassword
  }
}
