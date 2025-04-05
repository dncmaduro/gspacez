import {
  AppShell,
  Button,
  Divider,
  Flex,
  Image,
  Stack,
  Text
} from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Logo from '../public/Logo.png'
import { SignInForm } from '../components/SignInForm'
import { useEffect, useState } from 'react'
import { SignUpForm } from '../components/SignUpForm'
import { useAuthStore } from '../store/authStore'
import { useCallbackStore } from '../store/callbackStore'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  const [isSignIn, setIsSignIn] = useState(true)
  const navigate = useNavigate()
  const { callbackUrl } = useCallbackStore()

  const { accessToken } = useAuthStore()

  useEffect(() => {
    if (accessToken) {
      navigate({ to: callbackUrl || '/app' })
    }
  }, [accessToken])

  return (
    <AppShell>
      <AppShell.Main className="h-screen">
        <Flex h="100%">
          <Flex align="center" justify="center" className="h-full grow">
            <Stack gap={4} align="center">
              <Image src={Logo} w={300} />
              <Text size="xl">Join with other tech enthuasist</Text>
            </Stack>
          </Flex>
          <Divider orientation="vertical" />
          <Flex align="center" justify="center" className="h-full grow">
            <Stack gap={16}>
              {isSignIn ? <SignInForm /> : <SignUpForm />}
              <Button
                variant="light"
                size="sm"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn
                  ? 'Or create new account'
                  : 'Or sign in with your account'}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </AppShell.Main>
    </AppShell>
  )
}
