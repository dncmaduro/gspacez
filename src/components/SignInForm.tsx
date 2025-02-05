import {
  ActionIcon,
  Box,
  Button,
  FocusTrap,
  Stack,
  Text,
  TextInput
} from '@mantine/core'
import { useForm } from 'react-hook-form'
import { GIcon } from './common/GIcon'
import { useState } from 'react'

type SignInType = {
  email: string
  password: string
}

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  const formMethods = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const {
    register,
    formState: { isDirty, errors },
    handleSubmit
  } = formMethods

  const onSubmit = (values: SignInType) => {
    console.log(values)
  }

  return (
    <Box
      px={32}
      pb={32}
      pt={24}
      className="rounded-xl border border-violet-400 shadow-md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={24} align="center">
          <Text className="!text-[22px] !font-bold">Sign in to GspaceZ</Text>
          <FocusTrap active>
            <Stack align="center" gap={16}>
              <TextInput
                w={350}
                {...register('email', {
                  required: { value: true, message: 'Email is required' }
                })}
                error={errors.email?.message}
                placeholder="Enter your email..."
                leftSection={<GIcon name="Mail" size="18" />}
                label="Email"
                size="md"
                withAsterisk
              />
              <TextInput
                w={350}
                {...register('password', {
                  required: { value: true, message: 'Password is required' }
                })}
                error={errors.password?.message}
                placeholder="Enter your password..."
                label="Password"
                size="md"
                withAsterisk
                leftSection={<GIcon name="Lock" size="18" />}
                type={showPassword ? 'text' : 'password'}
                rightSection={
                  <ActionIcon
                    variant="subtle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <GIcon name={showPassword ? 'EyeOff' : 'Eye'} />
                  </ActionIcon>
                }
              />
            </Stack>
          </FocusTrap>
          <Button type="submit" disabled={!isDirty}>
            Sign in
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
