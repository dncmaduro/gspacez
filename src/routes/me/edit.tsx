import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useProfile } from '../../hooks/useProfile'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Box,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  SelectProps,
  Select,
  Textarea,
  Button,
  Image
} from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import { useCountries } from '../../hooks/useCountries'
import { useEffect, useMemo } from 'react'
import { GIcon } from '../../components/common/GIcon'
import { modals } from '@mantine/modals'
import { DatePickerInput } from '@mantine/dates'
import { UploadAvatarModal } from '../../components/profile/UploadAvatarModal'
import { format, parse } from 'date-fns'
import { useMe } from '../../hooks/useMe'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { UpdateMeRequest } from '../../hooks/models'
import { GToast } from '../../components/common/GToast'

export const Route = createFileRoute('/me/edit')({
  component: RouteComponent
})

interface SelectItem {
  value: string
  label: string
}

interface ProfileType {
  id: string
  firstName: string
  lastName: string
  dob: string
  country?: string
  description?: string
  avatarUrl?: string
}

function RouteComponent() {
  const { updateMe } = useProfile()
  const { getCountries } = useCountries()
  const token = useSelector((state: RootState) => state.auth.token)

  const { data: profileData } = useMe()

  const { mutate: updateProfile, isPending: isLoading } = useMutation({
    mutationKey: ['upload-profile'],
    mutationFn: ({ req }: { req: UpdateMeRequest }) => updateMe(req, token),
    onSuccess: () => {
      GToast.success({
        title: 'Update profile successfully!'
      })
    },
    onError: () => {
      GToast.error({
        title: 'Update profile failed!'
      })
    }
  })

  const { data: countriesData } = useQuery({
    queryKey: ['get-countries'],
    queryFn: () => {
      return getCountries()
    },
    select: (data) => {
      return data.data.data
    }
  })

  const countryOptions: SelectItem[] = useMemo(() => {
    return (countriesData || []).map((country) => ({
      value: country.name,
      label: country.name
    }))
  }, [countriesData])

  const countryFlags: Record<string, string> = useMemo(() => {
    return (countriesData || []).reduce(
      (acc, country) => {
        return { ...acc, [country.name]: country.flag }
      },
      {} as Record<string, string>
    )
  }, [countriesData])

  const renderSelectOption: SelectProps['renderOption'] = ({ option }) => (
    <Group flex="1" gap="sm">
      <Flex h={8} w={16} align="center" justify="center">
        <Image src={countryFlags[option.value]} alt={`${option.value} flag`} />
      </Flex>
      <Text>{option.label}</Text>
    </Group>
  )

  const { handleSubmit, control, watch, setValue, reset } =
    useForm<ProfileType>({
      defaultValues: {
        firstName: '',
        lastName: '',
        dob: '',
        country: '',
        description: '',
        avatarUrl: ''
      }
    })

  useEffect(() => {
    if (profileData) {
      reset(profileData)
    }
  }, [profileData, reset])

  const onSubmit = (values: ProfileType) => {
    updateProfile({ req: values })
  }

  const openUploadAvatarModal = () => {
    modals.open({
      title: <Text className="!font-bold">Upload Avatar</Text>,
      children: (
        <UploadAvatarModal
          setValue={(url: string) => {
            setValue('avatarUrl', url)
          }}
        />
      ),
      size: 'lg'
    })
  }

  return (
    <AppLayout>
      <Stack maw={1000} mx={'auto'} mt={32}>
        <Text className="!text-2xl !font-bold">
          Update things that people should know about you
        </Text>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          <Stack>
            <Flex align="flex-start">
              <Stack flex={3}>
                <Group>
                  <Controller
                    control={control}
                    name="firstName"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        withAsterisk
                        label="First name"
                        placeholder="Your first name"
                        radius="md"
                        size="md"
                        className="grow"
                        disabled={isLoading}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="lastName"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        withAsterisk
                        label="Last name"
                        placeholder="Your last name"
                        radius="md"
                        size="md"
                        className="grow"
                        disabled={isLoading}
                      />
                    )}
                  />
                </Group>
                <Controller
                  control={control}
                  name="dob"
                  rules={{ required: true }}
                  render={({ field }) => {
                    const dateValue = field.value
                      ? parse(field.value, 'yyyy-MM-dd', new Date())
                      : null

                    return (
                      <DatePickerInput
                        {...field}
                        value={dateValue}
                        onChange={(date) => {
                          field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                        }}
                        label="Date of Birth"
                        placeholder="Select your date of birth"
                        radius="md"
                        size="md"
                        disabled={isLoading}
                        leftSection={<GIcon name="Calendar" size={16} />}
                        withAsterisk
                      />
                    )
                  }}
                />
                <Controller
                  control={control}
                  name="country"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      renderOption={renderSelectOption}
                      data={countryOptions}
                      searchable
                      label="Where do you live?"
                      withAsterisk
                      radius="md"
                      size="md"
                      disabled={isLoading}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      minRows={4}
                      autosize
                      size="md"
                      disabled={isLoading}
                      label="More things you want to share with others"
                    />
                  )}
                />
              </Stack>
              <Box flex={2}>
                <Flex align="center" direction="column" gap={16}>
                  <Text className="!text-md !font-semibold">
                    Update your avatar
                  </Text>
                  {watch('avatarUrl') ? (
                    <Image
                      src={watch('avatarUrl')}
                      alt="Avatar"
                      mah={150}
                      maw={150}
                      className="!rounded-full border border-gray-400"
                    />
                  ) : (
                    <Box
                      h={150}
                      w={150}
                      onClick={!isLoading ? openUploadAvatarModal : undefined}
                      className="flex cursor-pointer items-center justify-center rounded-full border-1 border-gray-400 hover:bg-gray-50"
                    >
                      <GIcon name="Photo" size={24} color="gray" />
                    </Box>
                  )}
                  <Button
                    size="xs"
                    variant="default"
                    onClick={openUploadAvatarModal}
                    disabled={isLoading}
                  >
                    Upload new avatar
                  </Button>
                </Flex>
              </Box>
            </Flex>
            <Group justify="center" mt={20}>
              <Button w="fit-content" variant="default" disabled={isLoading}>
                Cancel
              </Button>
              <Button w="fit-content" type="submit" loading={isLoading}>
                Save
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AppLayout>
  )
}
