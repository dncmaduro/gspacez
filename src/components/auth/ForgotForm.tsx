import { Text, TextInput } from '@mantine/core'
import { GIcon } from '../common/GIcon'
import { useFormContext } from 'react-hook-form'
import { ForgotType } from '../../routes/recovery'

export const ForgotForm = () => {
  const {
    watch,
    formState: { errors },
    setValue,
    register
  } = useFormContext<ForgotType>()

  return (
    <>
      <Text className="!text-xl !font-bold">Start recovering your account</Text>
      <TextInput
        {...register('email', {
          required: true
        })}
        error={errors.email?.message}
        value={watch('email')}
        onChange={(e) => setValue('email', e.currentTarget.value)}
        size="md"
        leftSection={<GIcon name="Mail" size="18" />}
        placeholder="Enter your email..."
        w={400}
      />
    </>
  )
}
