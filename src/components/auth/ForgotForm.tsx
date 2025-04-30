import { Box, Button, Stack, Text, TextInput } from '@mantine/core'
import { GIcon } from '../common/GIcon'
import { useFormContext } from 'react-hook-form'
import { ForgotType } from '../../routes/recovery'
import { useMedia } from '../../hooks/useMedia'
import { useMemo } from 'react'

interface Props {
  isLoading: boolean
  onClick: () => void
}

export const ForgotForm = ({ isLoading, onClick }: Props) => {
  const {
    watch,
    formState: { errors },
    setValue,
    register
  } = useFormContext<ForgotType>()

  const { isMobile, isTablet } = useMedia()

  const isEmpty = useMemo(() => {
    if (watch('email') === '') return true
  }, [watch('email')])

  return (
    <Box
      className="rounded-xl border border-indigo-200 bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
      p={isMobile ? 16 : 24}
      w={isMobile ? '100%' : isTablet ? '90%' : 'auto'}
      maw={isMobile ? '100%' : isTablet ? 450 : 500}
    >
      <Stack gap={isMobile ? 16 : 24} align="center">
        <Text
          className={`!font-bold text-indigo-800 ${isMobile ? '!text-lg' : '!text-xl'}`}
          ta="center"
        >
          Start recovering your account
        </Text>

        <TextInput
          {...register('email', {
            required: { value: true, message: 'Email is required' },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Invalid email address'
            }
          })}
          error={errors.email?.message}
          value={watch('email')}
          onChange={(e) => setValue('email', e.currentTarget.value)}
          size={isMobile ? 'sm' : 'md'}
          leftSection={<GIcon name="Mail" size={isMobile ? '16' : '18'} />}
          placeholder="Enter your email address"
          w="100%"
          className="transition-all duration-200 focus-within:border-indigo-200/50"
          styles={{
            input: {
              border: '1px solid #E5E7EB'
            }
          }}
        />

        <Button
          type="submit"
          fullWidth
          size={isMobile ? 'sm' : 'md'}
          disabled={isEmpty}
          loading={isLoading}
          onClick={onClick}
          className="bg-indigo-600 transition-colors duration-200 hover:bg-indigo-700"
          leftSection={<GIcon name="ArrowRight" size={isMobile ? 16 : 18} />}
        >
          Continue Recovery
        </Button>

        <Text size={isMobile ? 'xs' : 'sm'} c="dimmed" ta="center">
          We'll send a recovery link to your email address to reset your
          password
        </Text>
      </Stack>
    </Box>
  )
}
