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
import { SquadPosts } from '../../components/squad/posts/SquadPosts'
import { useMedia } from '../../hooks/useMedia'

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

  const { isMobile } = useMedia()

  const squadTabs = [
    {
      label: 'Posts',
      value: 'posts',
      onlyAdmin: false,
      panel: <SquadPosts tagName={tagName} />
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
      <Box
        maw={1200}
        m="auto"
        pt={16}
        bg={'white'}
        px={24}
        mih={'90vh'}
        className="rounded-lg shadow-sm"
      >
        {isLoading ? (
          <Flex justify="center" align="center" h="50vh">
            <Loader size="md" />
          </Flex>
        ) : (
          <>
            <Helmet>
              <title>{data?.name} - Squad</title>
            </Helmet>
            <Stack gap={8}>
              <Flex
                align={'flex-start'}
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? 32 : 0}
                justify={'space-between'}
              >
                <Group gap={20}>
                  <Avatar
                    src={data?.avatarUrl}
                    size={isMobile ? 'lg' : 'xl'}
                    className="border-2 border-indigo-200 shadow-sm"
                    radius="md"
                  />
                  <Stack gap={4}>
                    <Group>
                      <Text
                        className={`${isMobile ? '!text-xl' : '!text-2xl'} !font-bold`}
                      >
                        {data?.name}
                      </Text>
                      <Badge
                        color={isPrivate ? 'red' : 'indigo'}
                        variant="light"
                        size={isMobile ? 'md' : 'lg'}
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
                    <Text
                      size={isMobile ? 'sm' : 'md'}
                      c={'dimmed'}
                      className="!font-medium"
                    >
                      @{data?.tagName}
                    </Text>
                  </Stack>
                </Group>
                {isAdmin ? (
                  <Flex
                    wrap={'wrap'}
                    align={'center'}
                    gap={8}
                    direction={isMobile ? 'row-reverse' : 'row'}
                  >
                    <CopyButton
                      value={`${window.location.origin}/squad/invite/${data?.tagName}?id=${profileData?.id}`}
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
                  </Flex>
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

              <Box mt={24}>
                <Text size="sm" fw={500} c="dimmed" mb={8}>
                  Squad Admins
                </Text>
                <Group gap={16}>
                  {adminResults.map(
                    (adminResult, index) =>
                      adminResult.data && (
                        <Group
                          key={data?.adminList[index].profileId}
                          gap={8}
                          className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1 transition-colors hover:bg-indigo-50"
                        >
                          <Avatar
                            src={adminResult.data.avatarUrl}
                            size={'sm'}
                            radius="xl"
                          />
                          <Text
                            component={Link}
                            to={`/profile/${adminResult.data.id}`}
                            className="!font-medium"
                          >
                            {adminResult.data.firstName}{' '}
                            {adminResult.data.lastName}
                          </Text>
                        </Group>
                      )
                  )}
                </Group>
              </Box>

              {data?.description && (
                <Box
                  p={16}
                  mt={20}
                  bg={'gray.0'}
                  className="rounded-lg border border-gray-200 shadow-sm"
                  maw={500}
                >
                  <Text className="!text-lg !font-bold" mb={8}>
                    About this squad
                  </Text>
                  <Text className="leading-relaxed text-gray-700">
                    {data?.description}
                  </Text>
                </Box>
              )}

              <Divider mt={24} mb={8} />

              <Group mt={8} gap={24}>
                <Group gap={8} className="rounded-full bg-gray-50 px-4 py-2">
                  <GIcon name="Users" size={18} color="#4263eb" />
                  <Text fw={500}>
                    {data?.totalMembers === 1
                      ? '1 member'
                      : `${data?.totalMembers} members`}
                  </Text>
                </Group>
                <Group gap={8} className="rounded-full bg-gray-50 px-4 py-2">
                  <GIcon name="FilePencil" size={18} color="#4263eb" />
                  <Text fw={500}>
                    {data?.totalPosts === 1
                      ? '1 post'
                      : `${data?.totalPosts} posts`}
                  </Text>
                </Group>
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
