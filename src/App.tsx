import {
  RouterProvider,
  createBrowserHistory,
  createRouter
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { Notifications } from '@mantine/notifications'

import './App.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { createTheme, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store/store'

const router = createRouter({ routeTree, history: createBrowserHistory() })

const theme = createTheme({
  primaryColor: 'indigo',
  luminanceThreshold: 0.5
})

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <Notifications />
          <RouterProvider router={router} />
        </MantineProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
