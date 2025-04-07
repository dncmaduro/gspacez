import { Avatar, Button, Flex, Group, Loader, Text } from '@mantine/core'
import { IPendingRequest } from '../../../hooks/interface'
import { useProfile } from '../../../hooks/useProfile'
import { useMutation, useQuery } from '@tanstack/react-query'
import { GIcon } from '../../common/GIcon'
import { useSquad } from '../../../hooks/useSquad'
import { GToast } from '../../common/GToast'
import { useMemo } from 'react'

interface Props {
  request: IPendingRequest
  refetch: () => void
  tagName: string
}

export const Request = ({ request, refetch, tagName }: Props) => {
  const { getProfile } = useProfile()
  const { rejectRequest, approveRequest } = useSquad()

  const { data: profile } = useQuery({
    queryKey: ['get-profile', request.profileId],
    queryFn: () => getProfile(request.profileId),
    select: (data) => {
      return data.data.result
    }
  })

  const { mutate: reject, isPending: isRejecting } = useMutation({
    mutationKey: ['reject-request', request.id],
    mutationFn: () => {
      return rejectRequest(tagName, { profileIds: [request.profileId] })
    },
    onSuccess: () => {
      GToast.success({
        title: 'Reject successfully!'
      })
      refetch()
    },
    onError: () => {
      GToast.error({
        title: 'Reject failed!'
      })
    }
  })

  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationKey: ['approve-request', request.id],
    mutationFn: () => {
      return approveRequest(tagName, { profileIds: [request.profileId] })
    },
    onSuccess: () => {
      GToast.success({
        title: 'Approve successfully!'
      })
      refetch()
    },
    onError: () => {
      GToast.error({
        title: 'Approve failed!'
      })
    }
  })

  const isLoading = useMemo(() => {
    return isRejecting || isApproving
  }, [isApproving, isRejecting])

  return (
    <Flex justify={'space-between'} align={'center'}>
      <Group>
        <Avatar src={profile?.avatarUrl} className="border border-gray-200" />
        <Text>{request.profileName}</Text>
      </Group>
      {isLoading ? (
        <Loader />
      ) : (
        <Group>
          <Button
            variant="outline"
            color="gray"
            radius={'md'}
            onClick={() => reject()}
            leftSection={<GIcon name="X" size={16} />}
          >
            Reject
          </Button>
          <Button
            variant="light"
            radius={'md'}
            onClick={() => approve()}
            leftSection={<GIcon name="Check" size={16} />}
          >
            Accept
          </Button>
        </Group>
      )}
    </Flex>
  )
}
