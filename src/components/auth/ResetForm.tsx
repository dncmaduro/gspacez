import { useFormContext } from 'react-hook-form'
import { ResetType } from '../../routes/recovery'
import { ActionIcon, Text, TextInput } from '@mantine/core'
import { GIcon } from '../common/GIcon'
import { useState } from 'react'

export const ResetForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  const {
    watch,
    formState: { errors },
    setValue,
    register
  } = useFormContext<ResetType>()

  return (
    <>
      <Text className="!text-xl !font-bold">Reset your password</Text>
      <TextInput
        {...(register('password'), { required: true })}
        error={errors.password?.message}
        value={watch('password')}
        onChange={(e) => setValue('password', e.currentTarget.value)}
        size="md"
        placeholder="Your new password"
        leftSection={<GIcon name="Lock" size={18} />}
        w={400}
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
        {...(register('confirmation'), { required: true })}
        error={errors.password?.message}
        value={watch('confirmation')}
        onChange={(e) => setValue('confirmation', e.currentTarget.value)}
        size="md"
        placeholder="Confirm your new password"
        leftSection={<GIcon name="Lock" size={18} />}
        w={400}
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
    </>
  )
}
