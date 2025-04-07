import { useQuery } from '@tanstack/react-query'
import { useSquad } from '../../../hooks/useSquad'
import {
  Group,
  Loader,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput
} from '@mantine/core'
import { useMemo, useState } from 'react'
import { GIcon } from '../../common/GIcon'
import { MemberInModal } from './MemberInModal'

interface Props {
  tagName: string
}

export const UpdateAdminsModal = ({ tagName }: Props) => {
  const { getMembers } = useSquad()
  const [searchText, setSearchText] = useState<string>('')
  const [option, setOption] = useState<string | null>('')

  const filterOptions = [
    {
      value: '',
      label: 'All'
    },
    {
      value: 'ADMIN',
      label: 'Admin'
    },
    {
      value: 'MEMBER',
      label: 'Member'
    }
  ]

  const { data: membersData, isLoading } = useQuery({
    queryKey: ['get-members'],
    queryFn: () => getMembers({ tagName }),
    select: (data) => {
      return data.data.result
    }
  })

  const members = useMemo(() => {
    return (membersData || [])
      .filter((member) => (!option ? true : member.role === option))
      .filter((member) => member.profileName.includes(searchText))
  }, [membersData, option, searchText])

  return (
    <Stack>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Group>
            <TextInput
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="grow"
              placeholder="Search members"
              leftSection={<GIcon name="Search" size={16} />}
            />
            <Select
              data={filterOptions}
              value={option}
              defaultValue={''}
              onChange={(e) => setOption(e)}
            />
          </Group>
          <ScrollArea.Autosize mah={600}>
            <Stack align="center" mt={8} gap={20}>
              {members ? (
                members.map((member) => (
                  <MemberInModal
                    tagName={tagName}
                    member={member}
                    key={member.id}
                  />
                ))
              ) : (
                <Text c="dimmed">No members found</Text>
              )}
            </Stack>
          </ScrollArea.Autosize>
        </>
      )}
    </Stack>
  )
}
