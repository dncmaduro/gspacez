import {
  Avatar,
  Box,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text
} from '@mantine/core'
import { useGSearch } from '../../hooks/useGSearch'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { Link } from '@tanstack/react-router'

interface Props {
  searchText: string
}

export const UsersSearch = ({ searchText }: Props) => {
  const { searchUsers } = useGSearch()
  const token = useSelector((state: RootState) => state.auth.token)

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['search-users'],
    queryFn: () => searchUsers({ searchText, page: 1, size: 20 }, token),
    select: (data) => {
      return data.data.result
    }
  })

  return (
    <Box>
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollArea.Autosize mah={'80vh'}>
          <Stack gap={8}>
            {usersData?.content.map((user) => (
              <Box
                p={16}
                component={Link}
                to={`/profile/${user.id}`}
                className="cursor-pointer rounded-lg border border-gray-300 hover:border-indigo-200 hover:bg-indigo-50"
              >
                <Group gap={8}>
                  <Avatar />
                  <Stack gap={0} align="flex-start">
                    <Text>{`${user.firstName} ${user.lastName}`}</Text>
                    <Text size="sm" c="dimmed">
                      {user.email}
                    </Text>
                  </Stack>
                </Group>
              </Box>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      )}
    </Box>
  )
}
