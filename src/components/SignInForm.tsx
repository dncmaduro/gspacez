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
import { GoogleSignIn } from './GoogleSignIn'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../store/authStore'
import { useMedia } from '../hooks/useMedia'

type SignInType = {
  email: string
  password: string
}

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const { isMobile } = useMedia()

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
    mutationKey: ['signin'],
    mutationFn: signIn,
    onSuccess: (response) => {
      GToast.success({
        title: 'Sign in successfully'
      })
      setAuth({
        accessToken: response.data.result.token,
        refreshToken: response.data.result.refreshToken
      })
    },
    onError: (response) => {
      GToast.error({
        title: 'Failed to sign in',
        subtitle: response.message
      })
    }
  })

  const onSubmit = (values: SignInType) => {
    mutateSignIn(values)
  }

  return (
    <Box
      px={isMobile ? 16 : 32}
      pb={isMobile ? 24 : 32}
      pt={isMobile ? 16 : 24}
      className="rounded-xl border border-indigo-400 shadow-md duration-300 hover:shadow-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={isMobile ? 16 : 24} align="center">
          <Text
            className={`!font-bold ${isMobile ? '!text-xl' : '!text-[22px]'}`}
          >
            Sign in to GspaceZ
          </Text>
          <FocusTrap active>
            <Stack align="center" gap={isMobile ? 12 : 16} w="100%">
              <TextInput
                w="100%"
                {...register('email', {
                  required: { value: true, message: 'Email is required' }
                })}
                error={errors.email?.message}
                placeholder="Enter your email..."
                leftSection={
                  <GIcon name="Mail" size={isMobile ? '16' : '18'} />
                }
                label="Email"
                size={isMobile ? 'sm' : 'md'}
                withAsterisk
                disabled={isSignInLoading}
              />
              <TextInput
                w="100%"
                {...register('password', {
                  required: { value: true, message: 'Password is required' }
                })}
                error={errors.password?.message}
                placeholder="Enter your password..."
                label="Password"
                size={isMobile ? 'sm' : 'md'}
                withAsterisk
                leftSection={
                  <GIcon name="Lock" size={isMobile ? '16' : '18'} />
                }
                type={showPassword ? 'text' : 'password'}
                disabled={isSignInLoading}
                rightSection={
                  <ActionIcon
                    variant="subtle"
                    onClick={() => setShowPassword(!showPassword)}
                    size={isMobile ? 'sm' : 'md'}
                  >
                    <GIcon
                      name={showPassword ? 'EyeOff' : 'Eye'}
                      size={isMobile ? '16' : '18'}
                    />
                  </ActionIcon>
                }
              />
            </Stack>
          </FocusTrap>
          <Button
            type="submit"
            disabled={!isDirty}
            loading={isSignInLoading}
            size={isMobile ? 'sm' : 'md'}
            fullWidth={isMobile}
          >
            Sign in
          </Button>
          <GoogleSignIn />
          <Button
            variant="subtle"
            color="red"
            onClick={() => navigate({ to: '/recovery' })}
            size={isMobile ? 'sm' : 'md'}
            fullWidth={isMobile}
          >
            Forgot password?
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
