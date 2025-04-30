import { useFormContext } from 'react-hook-form'
import { ResetType } from '../../routes/recovery'
import { ActionIcon, Button, Stack, Text, TextInput } from '@mantine/core'
import { GIcon } from '../common/GIcon'
import { useState } from 'react'
import { useMedia } from '../../hooks/useMedia'

interface Props {
  isLoading: boolean
  onClick: () => void
}

export const ResetForm = ({ isLoading, onClick }: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const { isMobile } = useMedia()

  const {
    watch,
    formState: { errors },
    setValue,
    register
  } = useFormContext<ResetType>()

  return (
    <Stack w="100%" gap={isMobile ? 12 : 16}>
      <Text
        className={`!font-bold text-indigo-800 ${isMobile ? '!text-lg' : '!text-xl'}`}
        ta="center"
      >
        Create your new password
      </Text>

      <Text
        size={isMobile ? 'xs' : 'sm'}
        c="dimmed"
        ta="center"
        mb={isMobile ? 4 : 8}
      >
        Your password must be different from previous used passwords
      </Text>

      <TextInput
        {...register('password', { required: 'Password is required' })}
        error={errors.password?.message}
        value={watch('password')}
        onChange={(e) => setValue('password', e.currentTarget.value)}
        size={isMobile ? 'sm' : 'md'}
        placeholder="Your new password"
        leftSection={<GIcon name="Lock" size={isMobile ? 16 : 18} />}
        w="100%"
        type={showPassword ? 'text' : 'password'}
        rightSection={
          <ActionIcon
            variant="subtle"
            onClick={() => setShowPassword(!showPassword)}
            size={isMobile ? 'sm' : 'md'}
          >
            <GIcon
              name={showPassword ? 'EyeOff' : 'Eye'}
              size={isMobile ? 16 : 18}
            />
          </ActionIcon>
        }
      />

      <TextInput
        {...register('confirmation', {
          required: 'Please confirm your password',
          validate: (value) =>
            value === watch('password') || 'Passwords do not match'
        })}
        error={errors.confirmation?.message}
        value={watch('confirmation')}
        onChange={(e) => setValue('confirmation', e.currentTarget.value)}
        size={isMobile ? 'sm' : 'md'}
        placeholder="Confirm your new password"
        leftSection={<GIcon name="Lock" size={isMobile ? 16 : 18} />}
        w="100%"
        type={showPassword ? 'text' : 'password'}
        rightSection={
          <ActionIcon
            variant="subtle"
            onClick={() => setShowPassword(!showPassword)}
            size={isMobile ? 'sm' : 'md'}
          >
            <GIcon
              name={showPassword ? 'EyeOff' : 'Eye'}
              size={isMobile ? 16 : 18}
            />
          </ActionIcon>
        }
      />

      <Text size="xs" c="dimmed" mt={4}>
        <GIcon
          name="Info"
          size={12}
          style={{ display: 'inline', marginRight: '4px' }}
        />
        Password should be at least 8 characters
      </Text>

      <Button
        size={isMobile ? 'sm' : 'md'}
        fullWidth
        onClick={onClick}
        loading={isLoading}
        className="bg-indigo-600 transition-colors duration-200 hover:bg-indigo-700"
      >
        Reset password
      </Button>
    </Stack>
  )
}
