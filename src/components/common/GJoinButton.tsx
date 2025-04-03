import { Button } from '@mantine/core'
import { useMemo } from 'react'
import { GIcon } from './GIcon'

interface Props {
  status: string
  loading: boolean
  onLeave: () => void
  onCancel: () => void
  onJoin: () => void
}

export const GJoinButton = ({
  status,
  loading,
  onLeave,
  onCancel,
  onJoin
}: Props) => {
  const color = useMemo(() => {
    if (status === 'ACCEPTED') return 'green'
    if (status === 'PENDING') return 'yellow'
    return 'indigo'
  }, [status])

  const text = useMemo(() => {
    if (status === 'ACCEPTED') return 'Joined'
    if (status === 'PENDING') return 'Requested'
    return 'Join squad'
  }, [status])

  const icon = useMemo(() => {
    if (status === 'ACCEPTED') return 'Check'
    if (status === 'PENDING') return 'Clock'
    return 'Login2'
  }, [status])

  const onClick = () => {
    if (status === 'ACCEPTED') return onLeave()
    if (status === 'PENDING') return onCancel()
    return onJoin()
  }

  return (
    <Button
      variant="outline"
      radius={'md'}
      leftSection={<GIcon name={icon} size={16} />}
      color={color}
      loading={loading}
      onClick={() => onClick()}
    >
      {text}
    </Button>
  )
}
