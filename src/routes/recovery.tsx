import Logo from '../public/Logo.png'
import {
  AppShell,
  Box,
  Button,
  Stack,
  Image,
  Text,
  Container
} from '@mantine/core'
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
import { ReactNode, useEffect, useState } from 'react'
import { VerifyForm } from '../components/auth/VerifyForm'
import { ResetForm } from '../components/auth/ResetForm'
import { useMedia } from '../hooks/useMedia'

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
  const { isMobile } = useMedia()

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

  const { handleSubmit: handleSubmitForgot, getValues: getValuesForgot } =
    forgotFormMethods
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

  const { mutate: mutateVerifyOtp } = useMutation({
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
        <ForgotForm
          isLoading={isSendingRecovery}
          onClick={handleSubmitForgot(submitForgot)}
        />
      </FormProvider>
    ),
    verify: (
      <FormProvider {...verifyFormMethods}>
        <VerifyForm />
      </FormProvider>
    ),
    recovery: (
      <FormProvider {...resetFormMethods}>
        <ResetForm
          isLoading={isResetingPassword}
          onClick={handleSubmitReset(submitReset)}
        />
      </FormProvider>
    )
  }

  return (
    <AppShell>
      <AppShell.Main className="animated-gradient h-screen">
        <Container size="xs" px={isMobile ? 16 : 24} py={isMobile ? 24 : 32}>
          <Box
            className="animate-fade-in-up rounded-xl bg-white/90 shadow-lg backdrop-blur-sm"
            p={isMobile ? 16 : 24}
            mt={isMobile ? 40 : 60}
          >
            <Stack align="center" gap={isMobile ? 16 : 24}>
              <Box>
                <Image
                  src={Logo}
                  h={isMobile ? 24 : 32}
                  fit="contain"
                  className="drop-shadow-md"
                  w={'auto'}
                />
              </Box>

              <Text
                size={isMobile ? 'lg' : 'xl'}
                fw={500}
                c="indigo.8"
                ta="center"
              >
                {recoveryStatus === 'forgot'
                  ? 'Recover your account'
                  : recoveryStatus === 'verify'
                    ? 'Verify your identity'
                    : 'Create new password'}
              </Text>

              {FormComponents[recoveryStatus]}

              <Button
                variant="subtle"
                size={isMobile ? 'xs' : 'sm'}
                onClick={() => navigate({ to: '/' })}
              >
                Back to login
              </Button>
            </Stack>
          </Box>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
