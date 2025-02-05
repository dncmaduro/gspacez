import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import './App.css'
import '@mantine/core/styles.css'

import { createTheme, MantineProvider } from '@mantine/core'

const router = createRouter({ routeTree })

const theme = createTheme({
  primaryColor: 'indigo',
  luminanceThreshold: 0.5
})

function App() {
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  )
}

export default App
