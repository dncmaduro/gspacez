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

type SignUpType = {
  email: string
  password: string
  confirmation: string
  firstName: string
  lastName: string
}

export const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  const formMethods = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmation: '',
      firstName: '',
      lastName: ''
    }
  })

  const {
    register,
    formState: { isDirty, errors },
    handleSubmit
  } = formMethods

  const onSubmit = (values: SignUpType) => {
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
          <Text className="!text-[22px] !font-bold">Sign up to GspaceZ</Text>
          <FocusTrap active>
            <Stack align="center" gap={16}>
              <TextInput
                w={400}
                {...register('email', {
                  required: { value: true, message: 'Email is required' },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
                placeholder="Enter your email..."
                leftSection={<GIcon name="Mail" size="18" />}
                label="Email"
                size="md"
                withAsterisk
              />
              <Group w={400} justify="space-between">
                <TextInput
                  w={190}
                  {...register('firstName', {
                    required: { value: true, message: 'Required' }
                  })}
                  error={errors.firstName?.message}
                  placeholder="Enter your first name..."
                  label="First name"
                  size="md"
                  withAsterisk
                />
                <TextInput
                  w={190}
                  {...register('lastName', {
                    required: { value: true, message: 'Required' }
                  })}
                  error={errors.lastName?.message}
                  placeholder="Enter your last name..."
                  label="Last name"
                  size="md"
                  withAsterisk
                />
              </Group>
              <TextInput
                w={400}
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
              <TextInput
                w={400}
                {...register('confirmation', {
                  required: { value: true, message: 'Confirmation is required' }
                })}
                error={errors.confirmation?.message}
                placeholder="Confirm your password..."
                label="Password confirmation"
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
            Sign up
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
