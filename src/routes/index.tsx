import { AppShell, Divider, Flex, Image, Stack, Text } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import Logo from '../public/Logo.png'
import { SignInForm } from '../components/SignInForm'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
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
            <SignInForm />
          </Flex>
        </Flex>
      </AppShell.Main>
    </AppShell>
  )
}
