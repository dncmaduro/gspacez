import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { GNotFound } from '../components/common/GNotFound'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return <GNotFound />
  }
})

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}
