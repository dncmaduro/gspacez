import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '../../components/layouts/admin/AdminLayout'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent
})

function RouteComponent() {
  return <AdminLayout>Hello "/admin/"!</AdminLayout>
}
