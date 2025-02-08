import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'

export const Route = createFileRoute('/app/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <AppLayout>
      <>CC</>
    </AppLayout>
  )
}
