import Logo from '../public/Logo.png'
import { AppShell, Box, Button, Stack, Image } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'
import { useMutation } from '@tanstack/react-query'
import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest
} from '../hooks/models'
import { GToast } from '../components/common/GToast'
import { FormProvider, useForm } from 'react-hook-form'
import { ForgotForm } from '../components/auth/ForgotForm'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { VerifyForm } from '../components/auth/VerifyForm'
import { ResetForm } from '../components/auth/ResetForm'

export const Route = createFileRoute('/recovery')({
  component: RouteComponent
})

export interface ForgotType {
  email: string
}

export interface VerifyType {
  email: string
  otp: string
}

export interface ResetType {
  email: string
  password: string
  confirmation: string
}

type RecoveryStatus = 'forgot' | 'verify' | 'recovery'

function RouteComponent() {
  const { forgotPassword, verifyOtp, resetPassword } = useAuth()
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus>('forgot')
  const navigate = useNavigate()

  const forgotFormMethods = useForm<ForgotType>({
    defaultValues: {
      email: ''
    }
  })
  const verifyFormMethods = useForm<VerifyType>({
    defaultValues: {
      email: '',
      otp: ''
    }
  })
  const resetFormMethods = useForm<ResetType>({
    defaultValues: {
      email: '',
      password: '',
      confirmation: ''
    }
  })

  const {
    handleSubmit: handleSubmitForgot,
    watch: watchForgot,
    getValues: getValuesForgot
  } = forgotFormMethods
  const {
    handleSubmit: handleSubmitVerify,
    watch: watchVerify,
    setValue: setValueVerify,
    getValues: getValuesVerify
  } = verifyFormMethods
  const {
    handleSubmit: handleSubmitReset,
    setValue: setValueReset,
    setError: setErrorReset
  } = resetFormMethods

  const { mutate: sendRecoveryRequest, isPending: isSendingRecovery } =
    useMutation({
      mutationKey: ['recovery-password'],
      mutationFn: (req: ForgotPasswordRequest) => forgotPassword(req),
      onSuccess: () => {
        GToast.success({
          title: 'Recovery code has been sent! Please check your email!'
        })
        setRecoveryStatus('verify')
        setValueVerify('email', getValuesForgot('email'))
      },
      onError: () => {
        GToast.error({
          title: 'Email is not available! Try another one!'
        })
      }
    })

  const { mutate: mutateVerifyOtp, isPending: isVerifyingOtp } = useMutation({
    mutationKey: ['verify-otp'],
    mutationFn: (req: VerifyOtpRequest) => verifyOtp(req),
    onSuccess: () => {
      GToast.success({
        title: 'Verify OTP successfully!'
      })
      setRecoveryStatus('recovery')
      setValueReset('email', getValuesVerify('email'))
    },
    onError: () => {
      GToast.error({
        title: 'Verify OTP failed! Try again'
      })
    }
  })

  const { mutate: mutateResetPassword, isPending: isResetingPassword } =
    useMutation({
      mutationKey: ['reset-password'],
      mutationFn: (req: ResetPasswordRequest) => resetPassword(req),
      onSuccess: () => {
        GToast.success({
          title: 'Reset password successfully!',
          subtitle: 'Try login with new password!'
        })
        navigate({ to: '/' })
      },
      onError: () => {
        GToast.error({
          title: 'Failed to reset password!'
        })
      }
    })

  const submitForgot = (values: ForgotType) => {
    sendRecoveryRequest(values)
  }

  const submitVerify = (values: VerifyType) => {
    mutateVerifyOtp(values)
  }

  const submitReset = (values: ResetType) => {
    if (values.confirmation !== values.password) {
      setErrorReset('confirmation', {
        message: 'Password confirmation is not match'
      })
    } else {
      mutateResetPassword({
        email: values.email,
        newPassword: values.password
      })
    }
  }

  useEffect(() => {
    if (watchVerify('otp').length === 6) {
      handleSubmitVerify(submitVerify)()
    }
  }, [watchVerify('otp')])

  const FormComponents: Record<RecoveryStatus, ReactNode> = {
    forgot: (
      <FormProvider {...forgotFormMethods}>
        <ForgotForm />
      </FormProvider>
    ),
    verify: (
      <FormProvider {...verifyFormMethods}>
        <VerifyForm />
      </FormProvider>
    ),
    recovery: (
      <FormProvider {...resetFormMethods}>
        <ResetForm />
      </FormProvider>
    )
  }

  const isEmpty = useMemo(() => {
    if (recoveryStatus === 'forgot' && watchForgot('email') === '') return true
  }, [recoveryStatus, watchForgot('email')])

  return (
    <AppShell>
      <AppShell.Main className="h-screen">
        <Box className="mx-auto w-fit" mt={32}>
          <Stack align="center">
            <Image src={Logo} h={120} />
            {FormComponents[recoveryStatus]}
            {recoveryStatus !== 'verify' && (
              <Button
                size="md"
                disabled={isEmpty}
                onClick={
                  recoveryStatus === 'forgot'
                    ? handleSubmitForgot(submitForgot)
                    : handleSubmitReset(submitReset)
                }
                loading={
                  isSendingRecovery || isVerifyingOtp || isResetingPassword
                }
              >
                {recoveryStatus === 'forgot'
                  ? 'Send recovery link'
                  : 'Reset password'}
              </Button>
            )}
          </Stack>
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}
