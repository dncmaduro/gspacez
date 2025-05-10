import { AppShell, Box, Button, Flex, Image, Stack, Text } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { useLogo } from '../hooks/useLogo'
import { useMedia } from '../hooks/useMedia'
import { GIcon } from '../components/common/GIcon'
import PS1 from '../public/Product_Screenshot_1.png'
import PS2 from '../public/Product_Screenshot_2.png'
import PS3 from '../public/Product_Screenshot_3.png'
import { Carousel } from '@mantine/carousel'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  const navigate = useNavigate()
  const { isMobile, isTablet } = useMedia()
  const { lightLogo } = useLogo()

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
        {/* Hero Section */}
        <AppShell.Header
          h={70}
          bg={'white'}
          className="border-b !border-indigo-100"
        >
          <Flex
            justify="space-between"
            align="center"
            h="100%"
            px={isMobile ? 16 : 32}
          >
            <Image
              src={lightLogo}
              alt="GspaceZ Logo"
              h={40}
              fit="contain"
              w={'auto'}
            />
            <Flex gap={16} align="center">
              <Button
                variant="subtle"
                color="indigo"
                onClick={() => navigate({ to: '/auth' })}
              >
                Sign In
              </Button>
              <Button onClick={() => navigate({ to: '/auth' })}>
                Get Started
              </Button>
            </Flex>
          </Flex>
        </AppShell.Header>

        <AppShell.Main>
          {/* Hero Section */}
          <Box className="bg-gradient-to-br from-indigo-50 to-blue-50 py-20">
            <Flex
              mt={40}
              direction={isMobile ? 'column' : 'row'}
              align="center"
              justify="space-between"
              gap={32}
              maw={1200}
              mx="auto"
              px={isMobile ? 16 : 32}
            >
              <Stack maw={600} gap={24}>
                <Text className="text-4xl leading-tight font-bold text-indigo-900 md:text-5xl">
                  Collaborate Smarter with AI-Powered Workspaces
                </Text>
                <Text size="xl" c="dimmed" className="leading-relaxed">
                  GspaceZ brings together tech communities with powerful
                  collaboration tools, AI assistance, and seamless content
                  creation.
                </Text>
                <Flex gap={16} mt={8}>
                  <Button size="lg">Start for Free</Button>
                  <Button size="lg" variant="light">
                    See How It Works
                  </Button>
                </Flex>
              </Stack>

              <Box className="flex h-[350px] w-full max-w-[500px] items-center justify-center rounded-xl">
                <Carousel
                  withControls={true}
                  emblaOptions={{
                    loop: true
                  }}
                  classNames={{
                    root: 'h-[350px] w-full max-w-[500px]'
                  }}
                >
                  <Carousel.Slide className="flex items-center justify-center">
                    <Image src={PS1} />
                  </Carousel.Slide>
                  <Carousel.Slide className="flex items-center justify-center">
                    <Image src={PS2} />
                  </Carousel.Slide>
                  <Carousel.Slide className="flex items-center justify-center">
                    <Image src={PS3} />
                  </Carousel.Slide>
                </Carousel>
              </Box>
            </Flex>
          </Box>

          {/* Features Section */}
          <Box py={80} bg="white">
            <Stack maw={1200} mx="auto" px={isMobile ? 16 : 32}>
              <Text
                ta="center"
                className="mb-16 text-3xl font-bold text-indigo-900"
              >
                Powerful Features for Modern Teams
              </Text>

              <Flex wrap="wrap" justify="center" gap={32}>
                {[
                  {
                    title: 'AI-Powered Content',
                    icon: 'Robot',
                    description:
                      'Create and refine content with our advanced AI assistant'
                  },
                  {
                    title: 'Squad Collaboration',
                    icon: 'Users',
                    description:
                      'Form specialized teams with shared workspaces and permissions'
                  },
                  {
                    title: 'Rich Markdown Editor',
                    icon: 'Edit',
                    description:
                      'Write beautiful content with our intuitive markdown editor'
                  },
                  {
                    title: 'Personalized Feeds',
                    icon: 'Rss',
                    description:
                      'Stay updated with content tailored to your interests'
                  }
                ].map((feature, i) => (
                  <Box
                    key={i}
                    className="rounded-xl bg-indigo-50 p-6"
                    w={isMobile ? '100%' : isTablet ? '45%' : '22%'}
                  >
                    <Stack align="center" gap={16}>
                      <Box className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600">
                        <GIcon name={feature.icon} color="white" size={24} />
                      </Box>
                      <Text fw={700} size="xl" ta="center">
                        {feature.title}
                      </Text>
                      <Text c="dimmed" ta="center">
                        {feature.description}
                      </Text>
                    </Stack>
                  </Box>
                ))}
              </Flex>
            </Stack>
          </Box>

          {/* Testimonials */}
          <Box
            py={80}
            className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white"
          >
            <Stack
              maw={1200}
              mx="auto"
              px={isMobile ? 16 : 32}
              align="center"
              gap={40}
            >
              <Text ta="center" className="text-3xl font-bold">
                Trusted by Tech Teams Worldwide
              </Text>

              {/* Product Image Placeholder */}
              <Box className="flex h-[250px] w-full max-w-[800px] items-center justify-center rounded-xl bg-red-500">
                <Text c="white" fw={700}>
                  TESTIMONIALS CAROUSEL HERE
                </Text>
              </Box>
            </Stack>
          </Box>

          {/* CTA Section */}
          <Box py={80} bg="white">
            <Stack
              maw={800}
              mx="auto"
              px={isMobile ? 16 : 32}
              align="center"
              gap={24}
            >
              <Text ta="center" className="text-3xl font-bold text-indigo-900">
                Ready to Transform Your Collaboration?
              </Text>
              <Text size="xl" c="dimmed" ta="center">
                Join thousands of tech professionals already using GspaceZ to
                build better together.
              </Text>
              <Button
                size="xl"
                mt={16}
                onClick={() => navigate({ to: '/auth' })}
              >
                Get Started for Free
              </Button>
            </Stack>
          </Box>

          {/* Footer */}
          <Box py={40} className="border-t border-gray-200 bg-gray-100">
            <Flex
              direction={isMobile ? 'column' : 'row'}
              justify="space-between"
              align={isMobile ? 'center' : 'flex-start'}
              maw={1200}
              mx="auto"
              px={isMobile ? 16 : 32}
              gap={isMobile ? 32 : 0}
            >
              <Stack align={isMobile ? 'center' : 'flex-start'} gap={16}>
                <Image src={lightLogo} alt="GspaceZ Logo" h={32} w={'auto'} />
                <Text c="dimmed" size="sm" ta={isMobile ? 'center' : 'left'}>
                  © 2023 GspaceZ. All rights reserved.
                </Text>
              </Stack>

              <Flex gap={40} wrap="wrap" justify="center">
                {[
                  'Features',
                  'Pricing',
                  'Documentation',
                  'About Us',
                  'Blog',
                  'Contact'
                ].map((item) => (
                  <Text
                    key={item}
                    fw={500}
                    className="cursor-pointer hover:text-indigo-600"
                  >
                    {item}
                  </Text>
                ))}
              </Flex>
            </Flex>
          </Box>
        </AppShell.Main>
      </AppShell>
    </>
  )
}
