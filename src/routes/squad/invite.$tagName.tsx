import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch
} from '@tanstack/react-router'
import { useSquad } from '../../hooks/useSquad'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { modals } from '@mantine/modals'
import { Box, Stack, Text } from '@mantine/core'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { InvitationModal } from '../../components/squad/InvitationModal'

export const Route = createFileRoute('/squad/invite/$tagName')({
  component: RouteComponent,
  validateSearch: (search) =>
    search as {
      id: string
    }
})

function RouteComponent() {
  const { tagName } = useParams({ from: '/squad/invite/$tagName' })
  const { id } = useSearch({ strict: false })
  const { getSquad } = useSquad()
  const navigate = useNavigate()

  const { data: squadData } = useQuery({
    queryKey: ['get-squad'],
    queryFn: () => {
      return getSquad(tagName)
    },
    select: (data) => {
      return data.data.result
    }
  })

  const adminIds = useMemo(() => {
    return squadData?.adminList.map((admin) => admin.profileId) || []
  }, [squadData])

  const goHome = () => {
    navigate({ to: '/app' })
  }

  const goSearch = () => {
    navigate({ to: '/search' })
  }

  useEffect(() => {
    if (squadData?.id && adminIds.includes(id)) {
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
        },
        size: 'lg'
      })
    } else {
      modals.open({
        id: `join-squad-failed`,
        title: <Box>Invalid Squad Invitation</Box>,
        children: (
          <Stack pt={16}>
            <Text>This is an invalid squad invitation.</Text>
            <Text>
              Go{' '}
              <span
                onClick={() => goHome()}
                className="cursor-pointer text-indigo-500"
              >
                back home
              </span>{' '}
              or{' '}
              <span
                className="cursor-pointer text-indigo-500"
                onClick={() => goSearch()}
              >
                search for a squad
              </span>
            </Text>
          </Stack>
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
        },
        size: 'lg'
      })
    }
  }, [squadData, adminIds])

  return (
    <AppLayout>
      <></>
    </AppLayout>
  )
}
