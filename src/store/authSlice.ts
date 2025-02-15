import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token
      document.cookie = `refreshToken=${action.payload.refreshToken}; path=/; secure; samesite=strict; max-age=${30 * 24 * 60 * 60}`
    },
    logout: (state) => {
      state.token = ''
      document.cookie =
        'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    }
  }
})

export const { setAuth, logout } = authSlice.actions
export const authReducer = authSlice.reducer
