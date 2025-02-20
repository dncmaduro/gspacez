import { IPost } from './interface'

export type SignInRequest = {
  email: string
  password: string
}

export type SignInResponse = {
  message?: string
  result: {
    token: string
    refreshToken: string
  }
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

export type GetNewsfeedRequest = {
  pageNum: number
  pageSize: number
}

export type GetNewsfeedResponse = {
  message?: string
  result: IPost[]
}

export type GetPostRequest = {
  id: string
}

export type GetPostResponse = {
  message?: string
  result: IPost
}

export type CreatePostRequest = {
  title: string
  text: string
  hashTags?: string[]
  privacy: string
}

export type CreatePostReponse = {
  message?: string
  result: IPost
}

export type UpdatePostRequest = {
  title: string
  text: string
  hashTags?: string[]
  privacy: string
}

export type UpdatePostResponse = {
  message?: string
  result: IPost
}
