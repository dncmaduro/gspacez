import { notifications } from '@mantine/notifications'

type ToastType = {
  title: string
  subtitle?: string
}

export const GToast = {
  success: (toast: ToastType) => {
    notifications.show({
      title: toast.title,
      message: toast.subtitle ?? '',
      color: 'green',
      position: 'bottom-left'
    })
  },

  error: (toast: ToastType) => {
    notifications.show({
      title: toast.title,
      message: toast.subtitle ?? '',
      color: 'red',
      position: 'bottom-left'
    })
  },

  information: (toast: ToastType) => {
    notifications.show({
      title: toast.title,
      message: toast.subtitle ?? '',
      color: 'indigo',
      position: 'bottom-left'
    })
  }
}
