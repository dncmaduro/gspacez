import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'

export const Route = createFileRoute('/discussions/')({
  component: RouteComponent
})

function RouteComponent() {
  return <AppLayout>Hello "/discussions/"!</AppLayout>
}
