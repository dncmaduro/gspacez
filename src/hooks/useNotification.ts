import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import { GetNotificationsResponse } from './models'

export const useNotification = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const getNotifications = async (id: string) => {
    return callApi<never, GetNotificationsResponse>({
      path: `/v1/notification/get-notification/${id}`,
      method: 'GET',
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const markAsRead = async (id: string) => {
    return callApi<never, never>({
      path: `/v1/notification/${id}/mark-read`,
      method: 'PATCH',
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const markAllAsRead = async (id: string) => {
    return callApi<never, never>({
      path: `/v1/notification/mark-all-read/${id}`,
      method: 'PATCH',
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const markAsUnread = async (id: string) => {
    return callApi<never, never>({
      path: `/v1/notification/${id}/mark-unread`,
      method: 'PATCH',
      accessToken,
      onClearAuth: clearAuth
    })
  }

  return { getNotifications, markAsRead, markAllAsRead, markAsUnread }
}
