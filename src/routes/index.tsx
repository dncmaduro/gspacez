import { AppShell, Box, Button, Flex, Image, Stack, Text } from '@mantine/core'
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
      <AppShell.Main className="animated-gradient h-screen">
        <Flex direction="column" align="center" justify="center" h="100%">
          <Stack align="center" mb={32} className="animate-fade-in-up">
            <Box className="overflow-hidden rounded-2xl">
              <Image src={Logo} w={200} className="drop-shadow-md" />
            </Box>
            <Text size="xl" fw={500} c="indigo.8">
              Join with other tech enthusiasts
            </Text>
          </Stack>

          <Box className="animate-fade-in-up rounded-xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
            {isSignIn ? <SignInForm /> : <SignUpForm />}

            <Button
              variant="subtle"
              size="sm"
              fullWidth
              mt={16}
              onClick={() => setIsSignIn(!isSignIn)}
            >
              {isSignIn
                ? 'Or create new account'
                : 'Or sign in with your account'}
            </Button>
          </Box>
        </Flex>
      </AppShell.Main>
    </AppShell>
  )
}
