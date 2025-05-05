import {
  ActionIcon,
  Box,
  Button,
  FocusTrap,
  Group,
  Stack,
  Text,
  TextInput
} from '@mantine/core'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { GIcon } from './common/GIcon'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { GToast } from './common/GToast'
import { useMedia } from '../hooks/useMedia'

type SignUpType = {
  email: string
  password: string
  confirmation: string
  profileTag: string
  firstName: string
  lastName: string
}

export const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { signUp } = useAuth()
  const { isMobile } = useMedia()

  const formMethods = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmation: '',
      profileTag: '',
      firstName: '',
      lastName: ''
    }
  })

  const {
    register,
    formState: { isDirty, errors },
    handleSubmit,
    setError
  } = formMethods

  const { mutate: mutateSignUp, isPending: isSignUpLoading } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      GToast.success({
        title: 'Sign up successfully'
      })
    },
    onError: (response) => {
      GToast.error({
        title: 'Failed to sign up',
        subtitle: response.message
      })
    }
  })

  const onSubmit = (values: SignUpType) => {
    if (values.confirmation !== values.password) {
      setError('confirmation', {
        message: 'Password confirmation is not match'
      })
    } else {
      mutateSignUp({
        email: values.email,
        password: values.password,
        profileTag: values.profileTag,
        firstName: values.firstName,
        lastName: values.lastName
      })
    }
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
            Sign up to GspaceZ
          </Text>
          <FocusTrap active>
            <Stack align="center" gap={isMobile ? 12 : 16} w="100%">
              <TextInput
                w="100%"
                {...register('email', {
                  required: { value: true, message: 'Email is required' },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
                placeholder="Enter your email..."
                leftSection={
                  <GIcon name="Mail" size={isMobile ? '16' : '18'} />
                }
                label="Email"
                size={isMobile ? 'sm' : 'md'}
                withAsterisk
                disabled={isSignUpLoading}
              />
              <Group
                w="100%"
                grow={isMobile}
                justify="space-between"
                gap={isMobile ? 8 : 16}
              >
                <TextInput
                  w={isMobile ? '100%' : '48%'}
                  {...register('firstName', {
                    required: { value: true, message: 'Required' }
                  })}
                  error={errors.firstName?.message}
                  placeholder="First name..."
                  label="First name"
                  size={isMobile ? 'sm' : 'md'}
                  withAsterisk
                  disabled={isSignUpLoading}
                />
                <TextInput
                  w={isMobile ? '100%' : '48%'}
                  {...register('lastName', {
                    required: { value: true, message: 'Required' }
                  })}
                  error={errors.lastName?.message}
                  placeholder="Last name..."
                  label="Last name"
                  size={isMobile ? 'sm' : 'md'}
                  withAsterisk
                  disabled={isSignUpLoading}
                />
              </Group>
              <TextInput
                w="100%"
                {...register('profileTag', {
                  required: { value: true, message: 'Profile tag is required' },
                  pattern: {
                    value: /^[a-zA-Z0-9_]{3,15}$/,
                    message:
                      'Only letters, numbers and underscore. 3-15 characters'
                  }
                })}
                error={errors.profileTag?.message}
                placeholder="Choose a unique username..."
                leftSection={<GIcon name="At" size={isMobile ? '16' : '18'} />}
                label="Profile Tag"
                size={isMobile ? 'sm' : 'md'}
                withAsterisk
                disabled={isSignUpLoading}
              />
              <TextInput
                w="100%"
                {...register('password', {
                  required: { value: true, message: 'Password is required' },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
                    message:
                      'Password must contain uppercase, lowercase, number, and special character'
                  }
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
                disabled={isSignUpLoading}
              />
              <TextInput
                w="100%"
                {...register('confirmation', {
                  required: { value: true, message: 'Confirmation is required' }
                })}
                error={errors.confirmation?.message}
                placeholder="Confirm password..."
                label="Password confirmation"
                size={isMobile ? 'sm' : 'md'}
                withAsterisk
                leftSection={
                  <GIcon name="Lock" size={isMobile ? '16' : '18'} />
                }
                type={showPassword ? 'text' : 'password'}
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
                disabled={isSignUpLoading}
              />
            </Stack>
          </FocusTrap>
          <Button
            type="submit"
            disabled={!isDirty}
            loading={isSignUpLoading}
            size={isMobile ? 'sm' : 'md'}
            fullWidth={isMobile}
          >
            Sign up
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
