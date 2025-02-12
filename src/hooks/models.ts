export type SignInRequest = {
  email: string
  password: string
}

export type SignInResponse = {
  message?: string
  token: string
  refreshToken: string
}

export type SignUpRequest = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type SignUpResponse = {
  message: string
}

export type IntrospectRequest = {
  token: string
}

export type IntrospectResponse = {
  message?: string
  result: {
    valid: boolean
  }
}

export type RefreshTokenRequest = {
  accessTokenExpired: string
  refreshToken: string
}

export type RefreshTokenResponse = {
  message?: string
  token: string
  refreshToken: string
}

export type LoginByGoogleResponse = {
  message?: string
  token: string
  refreshToken: string
}
