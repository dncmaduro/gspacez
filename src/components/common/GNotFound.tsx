import { AppShell, Box, Button, Flex, Group, Image, Text } from '@mantine/core'
import { GIcon } from './GIcon'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useLogo } from '../../hooks/useLogo'

export const GNotFound = () => {
  const navigate = useNavigate()
  const router = useRouter()
  const logo = useLogo()

  return (
    <AppShell>
      <AppShell.Main w="100vw" bg={'gray.1'}>
        <Flex w="100vw" h="100vh" align={'center'} justify={'center'}>
          <Box className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-8">
            <Image w={200} src={logo} />
            <Text>Your page is not found</Text>
            <Group>
              <Button
                leftSection={<GIcon name="ChevronLeft" size={16} />}
                variant="default"
                onClick={() => router.history.back()}
              >
                Back to previous page
              </Button>
              <Button
                leftSection={<GIcon name="Home" size={16} />}
                onClick={() => navigate({ to: '/app' })}
              >
                Go Home
              </Button>
            </Group>
          </Box>
        </Flex>
      </AppShell.Main>
    </AppShell>
  )
}
