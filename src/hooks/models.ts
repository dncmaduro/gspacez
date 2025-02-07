export type SignInRequest = {
  email: string
  password: string
}

export type SignInResponse = {
  message: string
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
