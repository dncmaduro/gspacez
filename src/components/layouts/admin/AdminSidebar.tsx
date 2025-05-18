import {
  ActionIcon,
  Box,
  Button,
  Group,
  Image,
  Stack,
  Text
} from '@mantine/core'
import { GIcon } from '../../common/GIcon'
import { SidebarPart } from '../SidebarPart'
import { SidebarItem } from '../SidebarItem'
import { useLogo } from '../../../hooks/useLogo'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../../../store/authStore'
import { useCallbackStore } from '../../../store/callbackStore'
import { GToast } from '../../common/GToast'

interface Props {
  toggle: () => void
  opened: boolean
}

export const AdminSidebar = ({ toggle, opened }: Props) => {
  const { logo } = useLogo()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()
  const { clearCallbackUrl } = useCallbackStore()

  const { mutate: onSignOut } = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: () => signOut(),
    onSuccess: () => {
      clearAuth()
      clearCallbackUrl()
      navigate({ to: '/auth' })
      GToast.success({
        title: 'Sign out successfully!'
      })
    },
    onError: () => {
      clearAuth()
      clearCallbackUrl()
      navigate({ to: '/auth' })
      GToast.error({
        title: 'Sign out failed!',
        subtitle:
          'Something happen! You should check other devices that you logged in'
      })
    }
  })

  return (
    <Box
      pt={12}
      px={opened ? 12 : 4}
      className="flex flex-col justify-between"
      h={'100%'}
      pb={24}
    >
      <Box>
        <Box h={60} className="flex items-center">
          <Image
            src={logo}
            alt="Logo"
            mx={'auto'}
            h={'60%'}
            w={'auto'}
            fit="contain"
            hidden={!opened}
            my={'auto'}
          />
        </Box>
        <Group justify={opened ? 'space-between' : 'center'}>
          {opened && (
            <Text c="gray" className="!text-[12px] !font-bold">
              DASHBOARD
            </Text>
          )}
          <ActionIcon
            variant="subtle"
            onClick={() => {
              toggle()
            }}
          >
            <GIcon
              name={
                opened
                  ? 'LayoutSidebarRightExpandFilled'
                  : 'LayoutSidebarLeftExpandFilled'
              }
              size={20}
              color="gray"
            />
          </ActionIcon>
        </Group>
        <Stack gap={32} pt={8}>
          <SidebarPart opened={opened}>
            <Stack gap={8}>
              <SidebarItem
                icon="Users"
                label="Users"
                href="/admin/users"
                opened={opened}
              />
              <SidebarItem
                icon="BrowserShare"
                label="Posts"
                href="/admin/posts"
                opened={opened}
              />
              <SidebarItem
                icon="ChartCohort"
                label="Squads"
                href="/admin/squads"
                opened={opened}
              />
            </Stack>
          </SidebarPart>
        </Stack>
      </Box>
      <Box>
        <Button
          variant="light"
          leftSection={<GIcon name="Power" size={16} />}
          color="red"
          w={'100%'}
          onClick={() => onSignOut()}
        >
          Sign out
        </Button>
      </Box>
    </Box>
  )
}
