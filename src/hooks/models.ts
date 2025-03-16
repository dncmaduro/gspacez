import { IComment, IPost } from './interface'

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  message?: string
  result: {
    token: string
    refreshToken: string
  }
}

export interface SignUpRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface SignUpResponse {
  message: string
}

export interface IntrospectRequest {
  token: string
}

export interface IntrospectResponse {
  message?: string
  result: {
    valid: boolean
  }
}

export interface RefreshTokenRequest {
  accessTokenExpired: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  message?: string
  token: string
  refreshToken: string
}

export interface LoginByGoogleResponse {
  message?: string
  token: string
  refreshToken: string
}

export interface GetNewsfeedRequest {
  pageNum: number
  pageSize: number
}

export interface GetNewsfeedResponse {
  message?: string
  result: IPost[]
}

export interface GetPostRequest {
  id: string
}

export interface GetPostResponse {
  message?: string
  result: IPost
}

export interface CreatePostRequest {
  title: string
  text: string
  hashTags?: string[]
  privacy: string
}

export interface CreatePostReponse {
  message?: string
  result: IPost
}

export interface UpdatePostRequest {
  title: string
  text: string
  hashTags?: string[]
  privacy: string
}

export interface UpdatePostResponse {
  message?: string
  result: IPost
}

export interface CreateCommentRequest {
  comment: {
    parentId: string
    content: {
      text: string
    }
  }
}

export interface CreateCommentResponse {
  message?: string
}

export interface GetMeResponse {
  message?: string
  result: {
    id: string
    avatarUrl?: string
    country?: string
    description?: string
    firstName: string
    lastName: string
    dob: string
  }
}

export interface GetCommentsReponse {
  message?: string
  result: IComment[]
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message?: string
  result: {
    message: string
  }
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface ResetPasswordRequest {
  email: string
  newPassword: string
}

export interface GetProfileResponse {
  message?: string
  result: {
    id: string
    avatarUrl?: string
    country?: string
    description?: string
    firstName: string
    lastName: string
    dob: string
  }
}

export interface GenerateTextRequest {
  prompt: string
}

export interface GetCountriesResponse {
  error: boolean
  msg: string
  data: {
    name: string
    flag: string
    iso2: string
    iso3: string
  }[]
}

export interface UpdateMeRequest {
  avatarUrl?: string
  country?: string
  description?: string
  firstName: string
  lastName: string
  dob: string
}

export interface UpdateMeResponse {
  message?: string
  result: {
    id: string
    avatarUrl?: string
    country?: string
    description?: string
    firstName: string
    lastName: string
    dob: string
  }
}
