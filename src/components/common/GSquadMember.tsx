import { Avatar, Badge, Box, Flex, Group, Text } from '@mantine/core'
import { IMember } from '../../hooks/interface'
import { useProfile } from '../../hooks/useProfile'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { DATE_SIMPLE_FORMAT } from '../../utils/constants'

interface Props {
  member: IMember
}

export const GSquadMember = ({ member }: Props) => {
  const { getProfile } = useProfile()

  const { data: memberData } = useQuery({
    queryKey: ['get-profile', member.id],
    queryFn: () => getProfile(member.profileId),
    select: (data) => {
      return data.data.result
    }
  })

  return (
    <Box w={'100%'}>
      <Flex justify={'space-between'} align={'center'}>
        <Group>
          <Avatar
            src={memberData?.avatarUrl}
            className="border border-gray-200"
          />
          <Text>{member.profileName}</Text>
          <Badge variant={member.role === 'ADMIN' ? 'filled' : 'outline'}>
            {member.role}
          </Badge>
        </Group>
        <Text c="dimmed" size="sm">
          Joined at {format(new Date(member.joinedAt), DATE_SIMPLE_FORMAT)}
        </Text>
      </Flex>
    </Box>
  )
}
