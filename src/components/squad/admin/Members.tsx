import { useQuery } from '@tanstack/react-query'
import { useSquad } from '../../../hooks/useSquad'
import { Button, Collapse, ScrollArea, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IMember } from '../../../hooks/interface'
import { GIcon } from '../../common/GIcon'
import { GSquadMember } from '../../common/GSquadMember'
import { modals } from '@mantine/modals'
import { UpdateAdminsModal } from './UpdateAdminsModal'

interface Props {
  tagName: string
  name: string
}

export const Members = ({ tagName, name }: Props) => {
  const { getMembers } = useSquad()
  const [adminOpened, { toggle: toggleAdmin }] = useDisclosure(true)
  const [memberOpened, { toggle: toggleMember }] = useDisclosure(true)

  const { data: membersData, refetch } = useQuery({
    queryKey: ['get-members'],
    queryFn: () => getMembers({ tagName }),
    select: (data) => {
      return data.data.result.content.reduce<{
        admins: IMember[]
        members: IMember[]
      }>(
        (acc, member) => {
          if (member.role === 'ADMIN') {
            return { ...acc, admins: [...acc.admins, member] }
          }
          return { ...acc, members: [...acc.members, member] }
        },
        { admins: [], members: [] }
      )
    }
  })

  return (
    <Stack mx={32} align="center">
      {membersData ? (
        <>
          <Button
            color="gray"
            size="md"
            radius="md"
            variant="light"
            w={'100%'}
            styles={{
              inner: {
                justifyContent: 'space-between'
              }
            }}
            rightSection={
              <GIcon
                name={adminOpened ? 'ChevronDown' : 'ChevronUp'}
                size={16}
              />
            }
            onClick={toggleAdmin}
          >
            Admins ({membersData.admins.length})
          </Button>
          <Collapse in={adminOpened} w={'100%'} px={32}>
            <Stack gap={32}>
              <ScrollArea.Autosize mah={300}>
                <Stack>
                  {membersData.admins.map((admin) => (
                    <GSquadMember member={admin} />
                  ))}
                </Stack>
              </ScrollArea.Autosize>
              <Button
                mx={'auto'}
                variant="light"
                onClick={() => {
                  modals.open({
                    title: `Update ${name} members roles`,
                    children: <UpdateAdminsModal tagName={tagName} />,
                    size: 'lg',
                    onClose: () => refetch()
                  })
                }}
              >
                Update your squad admins
              </Button>
            </Stack>
          </Collapse>

          <Button
            color="gray"
            size="md"
            radius="md"
            variant="light"
            w={'100%'}
            styles={{
              inner: {
                justifyContent: 'space-between'
              }
            }}
            rightSection={
              <GIcon
                name={memberOpened ? 'ChevronDown' : 'ChevronUp'}
                size={16}
              />
            }
            mt={16}
            onClick={toggleMember}
          >
            Members ({membersData.members.length})
          </Button>
          <Collapse in={memberOpened} w={'100%'} px={32}>
            <ScrollArea.Autosize mah={300}>
              {membersData.members.length ? (
                <Stack>
                  {membersData.members.map((admin) => (
                    <GSquadMember member={admin} />
                  ))}
                </Stack>
              ) : (
                <Text c="dimmed">No members found</Text>
              )}
            </ScrollArea.Autosize>
          </Collapse>
        </>
      ) : (
        <Text c="dimmed">
          <GIcon name="ZommExclamation" size={16} /> Error! No members found
        </Text>
      )}
    </Stack>
  )
}
