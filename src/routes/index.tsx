import { AppShell, Box, Button, Flex, Image, Stack, Text } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Logo from '../public/Logo.png'
import { SignInForm } from '../components/SignInForm'
import { useEffect, useState } from 'react'
import { SignUpForm } from '../components/SignUpForm'
import { useAuthStore } from '../store/authStore'
import { useCallbackStore } from '../store/callbackStore'
import { useMedia } from '../hooks/useMedia'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  const [isSignIn, setIsSignIn] = useState(true)
  const navigate = useNavigate()
  const { callbackUrl } = useCallbackStore()
  const { accessToken } = useAuthStore()
  const { isMobile, isTablet } = useMedia()

  useEffect(() => {
    if (accessToken) {
      navigate({ to: callbackUrl || '/app' })
    }
  }, [accessToken])

  return (
    <AppShell>
      <AppShell.Main className="animated-gradient h-screen">
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="100%"
          px={isMobile ? 16 : 32}
        >
          <Stack
            align="center"
            mb={isMobile ? 24 : 32}
            className="animate-fade-in-up"
            gap={isMobile ? 12 : 16}
          >
            <Box className="overflow-hidden rounded-2xl">
              <Image
                src={Logo}
                w={isMobile ? 150 : isTablet ? 180 : 200}
                className="drop-shadow-md"
              />
            </Box>
            <Text
              size={isMobile ? 'lg' : 'xl'}
              fw={500}
              c="indigo.8"
              ta="center"
            >
              Join with other tech enthusiasts
            </Text>
          </Stack>

          <Box
            className="animate-fade-in-up rounded-xl bg-white/90 shadow-lg backdrop-blur-sm"
            p={isMobile ? 16 : isTablet ? 20 : 24}
            w={isMobile ? '100%' : isTablet ? '80%' : '100%'}
            maw={isMobile ? '100%' : isTablet ? 450 : 550}
          >
            {isSignIn ? <SignInForm /> : <SignUpForm />}

            <Button
              variant="subtle"
              size={isMobile ? 'xs' : 'sm'}
              fullWidth
              mt={isMobile ? 12 : 16}
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
