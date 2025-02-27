import { useFormContext } from 'react-hook-form'
import { VerifyType } from '../../routes/recovery'
import { PinInput, Text } from '@mantine/core'

export const VerifyForm = () => {
  const { watch, setValue, register } = useFormContext<VerifyType>()

  return (
    <>
      <Text className="!text-xl !font-bold">Verify OTP</Text>
      <Text>Enter the OTP that has been sent to recover your password</Text>
      <PinInput
        {...register('otp')}
        onChange={(value) => setValue('otp', value)}
        length={6}
        size="md"
        value={watch('otp')}
      />
    </>
  )
}
