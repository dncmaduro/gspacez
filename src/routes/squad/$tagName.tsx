import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { useSquad } from '../../hooks/useSquad'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Group,
  Loader,
  Stack,
  Text
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useProfile } from '../../hooks/useProfile'

export const Route = createFileRoute('/squad/$tagName')({
  component: RouteComponent
})

function RouteComponent() {
  const { getSquad } = useSquad()
  const { getProfile } = useProfile()
  const { tagName } = useParams({ from: '/squad/$tagName' })
  const token = useSelector((state: RootState) => state.auth.token)

  const { data, isLoading } = useQuery({
    queryKey: ['get-squad'],
    queryFn: () => {
      return getSquad(tagName, token)
    },
    select: (data) => {
      return data.data.result
    }
  })

  const { data: admin } = useQuery({
    queryKey: ['get-admin', data?.adminId],
    queryFn: () => {
      return getProfile(data?.adminId || '')
    },
    select: (data) => {
      return data?.data.result
    }
  })

  const isPrivate = useMemo(() => {
    return data?.privacy === 'PRIVATE'
  }, [data])

  return (
    <AppLayout>
      <Box maw={1000} m="auto" pt={12}>
        {isLoading ? (
          <Loader mx={'auto'} />
        ) : (
          <>
            <Helmet>
              <title>{data?.name} - Squad</title>
            </Helmet>
            <Stack gap={0}>
              <Group gap={16}>
                <Avatar src={data?.avatarUrl} size={'lg'} />
                <Stack gap={0}>
                  <Group>
                    <Text className="!text-lg">{data?.name}</Text>
                    <Badge
                      color={isPrivate ? 'red' : 'indigo'}
                      variant="light"
                      leftSection={
                        <GIcon
                          name={isPrivate ? 'LockFilled' : 'World'}
                          size={16}
                        />
                      }
                    >
                      {data?.privacy}
                    </Badge>
                  </Group>
                  <Text size="sm" c={'dimmed'}>
                    {data?.tagName}
                  </Text>
                </Stack>
              </Group>

              <Group mt={24} gap={12}>
                <Avatar src={admin?.avatarUrl} size={'sm'} />
                <Text component={Link} to={`/profile/${data?.adminId}`}>
                  {data?.adminName} (Admin)
                </Text>
              </Group>

              <Box
                p={8}
                mt={16}
                bg={'gray.1'}
                className="rounded-lg border border-gray-200"
                maw={400}
              >
                <Text className="!font-bold" pl={8}>
                  About this squad
                </Text>
                <Text pl={8} pt={16}>
                  {data?.description}
                </Text>
              </Box>

              <Divider mt={16} />

              <Group mt={16}>
                <GIcon name="Users" size={16} />
                <Text>
                  {data?.totalMembers === 1
                    ? '1 member'
                    : `${data?.totalMembers} members`}
                </Text>
              </Group>
              <Group mt={8}>
                <GIcon name="FilePencil" size={16} />
                <Text>
                  {data?.totalPosts === 1
                    ? '1 post'
                    : `${data?.totalPosts} posts`}
                </Text>
              </Group>
            </Stack>
          </>
        )}
      </Box>
    </AppLayout>
  )
}
