import { Button, Divider, Flex, Stack, Text } from '@mantine/core'
import { ISquad } from '../../hooks/interface'
import { modals } from '@mantine/modals'
import { useSquad } from '../../hooks/useSquad'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { GToast } from '../common/GToast'

interface Props {
  squad: ISquad
  handleToSquad: () => void
}

export const InvitationModal = ({ squad, handleToSquad }: Props) => {
  const { sendRequest } = useSquad()
  const token = useSelector((state: RootState) => state.auth.token)
  const queryClient = useQueryClient()
  const closeModal = () => {
    modals.closeAll()
  }

  const { mutate: send, isPending: isSendingRequest } = useMutation({
    mutationKey: ['join-squad'],
    mutationFn: () => {
      return sendRequest({ tagName: squad.tagName }, token)
    },
    onSuccess: () => {
      GToast.success({
        title: 'Send request successfully!'
      })
      queryClient.invalidateQueries({ queryKey: ['get-squad'] })
      handleToSquad()
    },
    onError: () => {
      GToast.error({
        title: 'Send request failed'
      })
    }
  })

  if (squad.joinStatus === 'ACCEPTED')
    return (
      <Stack gap={16} pt={16}>
        <Text>
          You have joined <b>{squad.name}</b>
        </Text>
        <Divider />
        <Flex justify={'flex-end'} gap={8}>
          <Button variant="default" onClick={() => closeModal()}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleToSquad()
              closeModal()
            }}
          >
            Go to squad
          </Button>
        </Flex>
      </Stack>
    )

  if (squad.joinStatus === 'PENDING')
    return (
      <Stack gap={16} pt={16}>
        <Text>
          You are having a pending request to join <b>{squad.name}</b>
        </Text>
        <Divider />
        <Flex justify={'flex-end'} gap={8}>
          <Button variant="default" onClick={() => closeModal()}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleToSquad()
              closeModal()
            }}
          >
            Go to squad
          </Button>
        </Flex>
      </Stack>
    )

  return (
    <Stack gap={16} pt={16}>
      <Text>
        Do you want to join squad <b>{squad.name}</b>?
      </Text>
      <Divider />
      <Flex justify={'flex-end'} gap={8}>
        <Button variant="default" onClick={() => closeModal()}>
          Cancel
        </Button>
        <Button
          loading={isSendingRequest}
          onClick={() => {
            send()
          }}
        >
          Join
        </Button>
      </Flex>
    </Stack>
  )
}
