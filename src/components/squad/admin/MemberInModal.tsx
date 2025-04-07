import { useMutation, useQuery } from '@tanstack/react-query'
import { useSquad } from '../../../hooks/useSquad'
import { IMember } from '../../../hooks/interface'
import { Avatar, Badge, Box, Button, Flex, Group, Text } from '@mantine/core'
import { useProfile } from '../../../hooks/useProfile'
import { useMemo, useState } from 'react'
import { GToast } from '../../common/GToast'
import { useMe } from '../../../hooks/useMe'

interface Props {
  tagName: string
  member: IMember
}

export const MemberInModal = ({ tagName, member }: Props) => {
  const { updateRole } = useSquad()
  const { getProfile } = useProfile()
  const [role, setRole] = useState<string>(member.role)
  const { data: meData } = useMe()

  const { mutate: update } = useMutation({
    mutationKey: ['update-role'],
    mutationFn: ({ profileId, role }: { profileId: string; role: string }) =>
      updateRole(tagName, { profileId, role }),
    onSuccess: () => {
      setRole((prev) => {
        return prev === 'ADMIN' ? 'MEMBER' : 'ADMIN'
      }),
        GToast.success({
          title: 'Update role successfully!'
        })
    },
    onError: () => {
      GToast.error({
        title: 'Update role failed!'
      })
    }
  })

  const { data: profile } = useQuery({
    queryKey: ['get-profile', member.profileId],
    queryFn: () => getProfile(member.profileId),
    select: (data) => {
      return data.data.result
    }
  })

  const isAdmin = useMemo(() => {
    return role === 'ADMIN'
  }, [role])

  const onUpdateRole = () => {
    update({
      profileId: member.profileId,
      role: isAdmin ? 'MEMBER' : 'ADMIN'
    })
  }

  return (
    <Box w={'100%'}>
      <Flex justify={'space-between'} align={'center'}>
        <Group>
          <Avatar
            src={profile?.avatarUrl}
            className="border border-gray-200"
            size={'sm'}
          />
          <Text size="sm" c={'dimmed'}>
            {member.profileName}
          </Text>
          {isAdmin && <Badge size="sm">{member.role}</Badge>}
        </Group>
        {meData?.id !== member.profileId && (
          <Button
            variant="outline"
            color={isAdmin ? 'gray' : 'indigo'}
            radius={'sm'}
            onClick={onUpdateRole}
          >
            {isAdmin ? 'Remove from admins' : 'Assign as an admin'}
          </Button>
        )}
      </Flex>
    </Box>
  )
}
