import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

type AxiosCallApi<D> = {
  path: string
  data?: D
  accessToken?: string
  customUrl?: string
  method: AxiosRequestConfig['method']
  onClearAuth?: () => void
}

interface BaseResponse {
  code: number
}

export async function callApi<D = unknown, T = unknown>({
  path,
  data,
  accessToken,
  customUrl,
  method,
  onClearAuth
}: AxiosCallApi<D>): Promise<AxiosResponse<T & BaseResponse>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  try {
    const response = await axios<T & BaseResponse>({
      url: (customUrl ?? import.meta.env.VITE_BACKEND_URL) + path,
      headers,
      data,
      method
    })

    if (response.data.code === 1401) {
      onClearAuth?.()
    }

    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      onClearAuth?.()
    }
    throw error
  }
}
