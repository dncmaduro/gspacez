import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useSquad } from '../../hooks/useSquad'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { modals } from '@mantine/modals'
import { Box } from '@mantine/core'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { InvitationModal } from '../../components/squad/InvitationModal'

export const Route = createFileRoute('/squad/invite/$tagName')({
  component: RouteComponent
})

function RouteComponent() {
  const { tagName } = useParams({ from: '/squad/invite/$tagName' })
  const token = useSelector((state: RootState) => state.auth.token)
  const { getSquad } = useSquad()
  const navigate = useNavigate()

  const { data: squadData } = useQuery({
    queryKey: ['get-squad'],
    queryFn: () => {
      return getSquad(tagName, token)
    },
    select: (data) => {
      return data.data.result
    }
  })

  useEffect(() => {
    if (squadData?.id) {
      modals.open({
        id: `join-squad-${squadData.tagName}`,
        title: (
          <Box>
            This is an invitation to join squad <b>{squadData.name}</b>
          </Box>
        ),
        children: (
          <InvitationModal
            squad={squadData}
            handleToSquad={() =>
              navigate({ to: `/squad/${squadData.tagName}` })
            }
          />
        ),
        onClose: () => {
          if (window.location.pathname.includes('/squad/invite')) {
            navigate({ to: '/app' })
          }
          modals.closeAll()
        },
        styles: {
          header: {
            background: '#e9ecef',
            paddingTop: '0px',
            paddingBottom: '0px'
          }
        }
      })
    }
  }, [squadData])

  return (
    <AppLayout>
      <></>
    </AppLayout>
  )
}
