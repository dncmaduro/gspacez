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
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { GToast } from './common/GToast'

type SignInType = {
  email: string
  password: string
}

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()

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

  const { mutate: mutateSignIn, isPending: isSignInLoading } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      GToast.success({
        title: 'Sign in successfully'
      })
    },
    onError: () => {
      GToast.error({
        title: 'Failed to signin'
      })
    }
  })

  const onSubmit = (values: SignInType) => {
    mutateSignIn(values)
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
                w={400}
                {...register('email', {
                  required: { value: true, message: 'Email is required' }
                })}
                error={errors.email?.message}
                placeholder="Enter your email..."
                leftSection={<GIcon name="Mail" size="18" />}
                label="Email"
                size="md"
                withAsterisk
                disabled={isSignInLoading}
              />
              <TextInput
                w={400}
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
                disabled={isSignInLoading}
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
          <Button type="submit" disabled={!isDirty} loading={isSignInLoading}>
            Sign in
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
