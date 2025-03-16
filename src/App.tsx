import {
  RouterProvider,
  createBrowserHistory,
  createRouter
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { HelmetProvider } from 'react-helmet-async'

import './App.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/carousel/styles.css'

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
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <Notifications />
              <RouterProvider router={router} />
            </ModalsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  )
}

export default App
