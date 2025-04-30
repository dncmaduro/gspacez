import { AppShell, Box, Button, Flex, Image, Stack, Text } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Logo from '../public/Logo.png'
import { SignInForm } from '../components/SignInForm'
import { useEffect, useState } from 'react'
import { SignUpForm } from '../components/SignUpForm'
import { useAuthStore } from '../store/authStore'
import { useCallbackStore } from '../store/callbackStore'
import { useMedia } from '../hooks/useMedia'
import { Helmet } from 'react-helmet-async'

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
    <>
      <Helmet>
        <title>
          GspaceZ – Smart Collaboration Platform for Tech Communities
        </title>
        <meta
          name="description"
          content="GspaceZ is a modern collaboration platform featuring AI-powered content creation, Markdown support, Squad-based communities, Google OAuth, and personalized feeds."
        />
        <meta
          name="keywords"
          content="GspaceZ, tech collaboration, markdown editor, AI assistant, squads, Google login, content creation, personalized newsfeed"
        />
        <meta
          property="og:title"
          content="GspaceZ – Smart Collaboration Platform"
        />
        <meta
          property="og:description"
          content="Create, collaborate, and connect with tech enthusiasts through GspaceZ – powered by AI and designed for seamless teamwork."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dszkt92jr/image/upload/v1746025562/z3t7hdeyspeeswnu7xff.png"
        />
        <meta property="og:url" content="https://gspacez.blog/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
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
    </>
  )
}
