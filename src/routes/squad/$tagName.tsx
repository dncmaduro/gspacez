import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
  useSearch
} from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { useSquad } from '../../hooks/useSquad'
import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import {
  Avatar,
  Badge,
  Box,
  Button,
  CopyButton,
  Divider,
  Flex,
  Group,
  Loader,
  Stack,
  Tabs,
  Text
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useProfile } from '../../hooks/useProfile'
import { AxiosResponse } from 'axios'
import { GetProfileResponse } from '../../hooks/models'
import { GToast } from '../../components/common/GToast'
import { modals } from '@mantine/modals'
import { GJoinButton } from '../../components/common/GJoinButton'
import { useMe } from '../../hooks/useMe'
import { PendingRequests } from '../../components/squad/admin/PendingRequests'
import { Members } from '../../components/squad/admin/Members'

export const Route = createFileRoute('/squad/$tagName')({
  component: RouteComponent,
  validateSearch: (search) =>
    search as {
      tab: string
    }
})

function RouteComponent() {
  const { getSquad, sendRequest, leaveSquad, cancelRequest } = useSquad()
  const { tab } = useSearch({ strict: false })
  const { getProfile } = useProfile()
  const { tagName } = useParams({ from: '/squad/$tagName' })
  const navigate = useNavigate()
  const { data: profileData } = useMe()

  const {
    data,
    isLoading,
    refetch: refetchSquad
  } = useQuery({
    queryKey: ['get-squad', tagName],
    queryFn: () => {
      return getSquad(tagName)
    },
    select: (data) => {
      return data.data.result
    }
  })

  const isAdmin = useMemo(() => {
    return data?.canBeEdited
  }, [data])

  const queries = useMemo(() => {
    if (!data?.adminList) return []

    return data.adminList.map((admin) => ({
      queryKey: ['get-admin', admin.profileId],
      queryFn: () => getProfile(admin.profileId),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      select: (data: AxiosResponse<GetProfileResponse, any>) => {
        return data?.data.result
      }
    }))
  }, [data, getProfile])

  const adminResults = useQueries({ queries })

  const isPrivate = useMemo(() => {
    return data?.privacy === 'PRIVATE'
  }, [data])

  const { mutate: send, isPending: isSendingRequest } = useMutation({
    mutationKey: ['join-squad'],
    mutationFn: () => {
      return sendRequest({ tagName })
    },
    onSuccess: () => {
      GToast.success({
        title: 'Send request successfully!'
      })
      refetchSquad()
    },
    onError: () => {
      GToast.error({
        title: 'Send request failed'
      })
    }
  })

  const handleJoinSquad = () => {
    if (data?.tagName) {
      send()
    }
  }

  const { mutate: leave, isPending: isSendingLeave } = useMutation({
    mutationKey: ['leave-squad'],
    mutationFn: () => {
      return leaveSquad({ tagName })
    },
    onSuccess: () => {
      GToast.success({
        title: 'Leave squad successfully!'
      })
      refetchSquad()
    },
    onError: () => {
      GToast.error({
        title: 'Leave squad failed'
      })
    }
  })

  const { mutate: cancel, isPending: isSendingCancel } = useMutation({
    mutationKey: ['cancel-request'],
    mutationFn: () => {
      return cancelRequest({ tagName })
    },
    onSuccess: () => {
      GToast.success({
        title: 'Cancel request successfully!'
      })
      refetchSquad()
    },
    onError: () => {
      GToast.error({
        title: 'Cancel request failed'
      })
    }
  })

  const handleLeaveSquad = () => {
    if (data?.tagName) {
      modals.openConfirmModal({
        title: (
          <Text>
            Are you sure to leave squad{' '}
            <span className="font-bold">{data.name}</span>?
          </Text>
        ),
        onConfirm: () => {
          leave()
          modals.closeAll()
        },
        onCancel: () => modals.closeAll(),
        labels: {
          confirm: 'Leave',
          cancel: 'Cancel'
        },
        confirmProps: { color: 'red' }
      })
    }
  }

  const handleCancelRequest = () => {
    if (data?.tagName) {
      modals.openConfirmModal({
        title: (
          <Text>
            Are you sure to cancel request{' '}
            <span className="font-bold">{data.name}</span>?
          </Text>
        ),
        onConfirm: () => {
          cancel()
          modals.closeAll()
        },
        onCancel: () => modals.closeAll(),
        labels: {
          confirm: 'Confirm',
          cancel: 'Cancel'
        },
        confirmProps: { color: 'red' }
      })
    }
  }

  const squadTabs = [
    {
      label: 'Posts',
      value: 'posts',
      onlyAdmin: false,
      panel: <></>
    },
    {
      label: 'Manage squad',
      value: 'manage-squad',
      onlyAdmin: true,
      panel: (
        <Tabs orientation="vertical" mt={32} defaultValue={'pending-requests'}>
          <Tabs.List>
            <Tabs.Tab value="pending-requests">Pending requests</Tabs.Tab>
            <Tabs.Tab value="members-manage">Manage members/admins</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pending-requests">
            <PendingRequests tagName={tagName} />
          </Tabs.Panel>

          <Tabs.Panel value="members-manage">
            <Members tagName={tagName} name={data?.name || ''} />
          </Tabs.Panel>
        </Tabs>
      )
    }
  ]

  return (
    <AppLayout>
      <Box maw={1200} m="auto" pt={12}>
        {isLoading ? (
          <Loader mx={'auto'} />
        ) : (
          <>
            <Helmet>
              <title>{data?.name} - Squad</title>
            </Helmet>
            <Stack gap={0}>
              <Flex align={'flex-start'} justify={'space-between'}>
                <Group gap={16}>
                  <Avatar
                    src={data?.avatarUrl}
                    size={'lg'}
                    className="border border-gray-300"
                  />
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
                {isAdmin ? (
                  <Group>
                    <CopyButton
                      value={`/squad/invite/${data?.tagName}?id=${profileData?.id}`}
                    >
                      {({ copied, copy }) => (
                        <Button
                          radius={'md'}
                          variant="subtle"
                          leftSection={<GIcon name="DoorEnter" size={16} />}
                          onClick={copy}
                          color={copied ? 'green' : 'indigo'}
                        >
                          {copied ? 'Copied' : 'Copy invite link'}
                        </Button>
                      )}
                    </CopyButton>
                    <Button
                      variant="default"
                      leftSection={<GIcon name="Pencil" size={16} />}
                      radius={'md'}
                      component={Link}
                      to={`/squad/edit/${data?.tagName}`}
                    >
                      Edit your squad
                    </Button>
                  </Group>
                ) : (
                  <GJoinButton
                    status={data?.joinStatus || ''}
                    loading={
                      isSendingLeave || isSendingRequest || isSendingCancel
                    }
                    onLeave={() => handleLeaveSquad()}
                    onCancel={() => handleCancelRequest()}
                    onJoin={() => handleJoinSquad()}
                  />
                )}
              </Flex>

              <Group mt={24} gap={12}>
                {adminResults.map(
                  (adminResult, index) =>
                    adminResult.data && (
                      <Group key={data?.adminList[index].profileId} gap={12}>
                        <Avatar src={adminResult.data.avatarUrl} size={'sm'} />
                        <Text
                          component={Link}
                          to={`/profile/${adminResult.data.id}`}
                        >
                          {adminResult.data.firstName}{' '}
                          {adminResult.data.lastName}
                        </Text>
                      </Group>
                    )
                )}
              </Group>

              {data?.description && (
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
              )}

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
              <Tabs
                variant="outline"
                mt={32}
                defaultValue={tab || 'posts'}
                onChange={(value) =>
                  navigate({ to: `/squad/${tagName}?tab=${value}` })
                }
              >
                <Tabs.List>
                  {squadTabs
                    .filter((tab) => !tab.onlyAdmin || isAdmin)
                    .map((tab) => (
                      <Tabs.Tab key={tab.value} value={tab.value}>
                        {tab.label}
                      </Tabs.Tab>
                    ))}
                </Tabs.List>

                {squadTabs
                  .filter((tab) => !tab.onlyAdmin || isAdmin)
                  .map((tab) => (
                    <Tabs.Panel key={tab.value} value={tab.value}>
                      {tab.panel}
                    </Tabs.Panel>
                  ))}
              </Tabs>
            </Stack>
          </>
        )}
      </Box>
    </AppLayout>
  )
}
