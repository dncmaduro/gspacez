import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
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
  Image,
  ActionIcon,
  Divider
} from '@mantine/core'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { useCountries } from '../../hooks/useCountries'
import { useEffect, useMemo } from 'react'
import { GIcon } from '../../components/common/GIcon'
import { modals } from '@mantine/modals'
import { DatePickerInput } from '@mantine/dates'
import { UploadAvatarModal } from '../../components/profile/UploadAvatarModal'
import { format, parse } from 'date-fns'
import { useMe } from '../../hooks/useMe'
import { UpdateMeRequest } from '../../hooks/models'
import { GToast } from '../../components/common/GToast'
import { cloneDeep } from 'lodash'
import { useDark } from '../../hooks/useDark'

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
  profileTag: string
  dob: string
  country?: string
  description?: string
  avatarUrl?: string
  socialMediaRequests: {
    platform: string
    url: string
  }[]
}

function RouteComponent() {
  const { updateMe } = useProfile()
  const { getCountries } = useCountries()
  const { isDark } = useDark()

  const { data: profileData } = useMe()

  const { mutate: updateProfile, isPending: isLoading } = useMutation({
    mutationKey: ['upload-profile'],
    mutationFn: ({ req }: { req: UpdateMeRequest }) => updateMe(req),
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
        profileTag: '',
        dob: '',
        country: '',
        description: '',
        avatarUrl: '',
        socialMediaRequests: []
      }
    })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialMediaRequests'
  })

  const addSocialMedia = () => {
    if (fields.length < 6) {
      append({ platform: '', url: '' })
    }
  }

  useEffect(() => {
    if (!profileData) return

    const cloned = cloneDeep(profileData)
    const platformsDefault = ['twitter', 'linkedin', 'github']

    if (!Array.isArray(cloned.socialMediaRequests)) {
      cloned.socialMediaRequests = []
    }

    const existingPlatforms = new Set(
      cloned.socialMediaRequests.map((item) => item.platform.toLowerCase())
    )

    platformsDefault.forEach((platform) => {
      if (!existingPlatforms.has(platform)) {
        cloned.socialMediaRequests.unshift({ platform, url: '' })
      }
    })

    reset(cloned)
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
      <Box maw={1200} mx="auto" py={40} px={{ base: 16, md: 32 }}>
        <Stack gap={32}>
          <Box>
            <Text className="mb-2 !text-3xl !font-bold text-indigo-800">
              Edit Profile
            </Text>
            <Text c="dimmed" size="lg">
              Update your information to help others know you better
            </Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={32}
              align="flex-start"
            >
              {/* Avatar Section */}
              <Box w={{ base: '100%', md: 280 }}>
                <Box
                  className={`rounded-xl border ${isDark ? 'border-indigo-700' : 'border-gray-200'} bg-${isDark ? 'gray.8' : 'white'} p-6 shadow-sm`}
                >
                  <Stack align="center" gap={16}>
                    <Text className="!text-lg !font-semibold text-gray-700">
                      Profile Photo
                    </Text>

                    {watch('avatarUrl') ? (
                      <Box className="group relative">
                        <Image
                          src={watch('avatarUrl')}
                          alt="Avatar"
                          height={180}
                          width={180}
                          className="!rounded-full border-4 border-indigo-100 shadow-md transition-all duration-300"
                        />
                        <Box
                          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          onClick={
                            !isLoading ? openUploadAvatarModal : undefined
                          }
                        >
                          <GIcon name="Camera" size={32} color="white" />
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        h={180}
                        w={180}
                        onClick={!isLoading ? openUploadAvatarModal : undefined}
                        className="flex cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-indigo-300 bg-indigo-50/50 transition-colors duration-300 hover:bg-indigo-100/50"
                      >
                        <GIcon name="Photo" size={40} color="#6366f1" />
                      </Box>
                    )}

                    <Button
                      leftSection={<GIcon name="Upload" size={16} />}
                      variant="light"
                      color="indigo"
                      onClick={openUploadAvatarModal}
                      disabled={isLoading}
                      fullWidth
                    >
                      Upload new photo
                    </Button>
                  </Stack>
                </Box>
              </Box>

              {/* Form Fields */}
              <Box
                className={`rounded-xl border ${isDark ? 'border-indigo-700' : 'border-gray-200'} bg-${isDark ? 'gray.8' : 'white'} p-8 shadow-sm`}
                flex={1}
              >
                <Stack gap={24}>
                  <Text className="!text-xl !font-semibold text-gray-800">
                    Personal Information
                  </Text>

                  <Group grow>
                    <Controller
                      control={control}
                      name="firstName"
                      rules={{ required: 'First name is required' }}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          withAsterisk
                          label="First name"
                          placeholder="Your first name"
                          radius="md"
                          size="md"
                          error={fieldState.error?.message}
                          disabled={isLoading}
                          leftSection={<GIcon name="User" size={16} />}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="lastName"
                      rules={{ required: 'Last name is required' }}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          withAsterisk
                          label="Last name"
                          placeholder="Your last name"
                          radius="md"
                          size="md"
                          error={fieldState.error?.message}
                          disabled={isLoading}
                          leftSection={<GIcon name="User" size={16} />}
                        />
                      )}
                    />
                  </Group>

                  <Group grow>
                    <Controller
                      control={control}
                      name="dob"
                      rules={{ required: 'Date of birth is required' }}
                      render={({ field, fieldState }) => {
                        const dateValue = field.value
                          ? parse(field.value, 'yyyy-MM-dd', new Date())
                          : null

                        return (
                          <DatePickerInput
                            {...field}
                            value={dateValue}
                            onChange={(date) => {
                              field.onChange(
                                date ? format(date, 'yyyy-MM-dd') : ''
                              )
                            }}
                            label="Date of Birth"
                            placeholder="Select your date of birth"
                            radius="md"
                            size="md"
                            disabled={isLoading}
                            leftSection={<GIcon name="Calendar" size={16} />}
                            withAsterisk
                            error={fieldState.error?.message}
                          />
                        )
                      }}
                    />

                    <Controller
                      control={control}
                      name="profileTag"
                      rules={{ required: 'Profile tag is required' }}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          withAsterisk
                          label="Profile Tag"
                          placeholder="Your unique profile tag"
                          radius="md"
                          size="md"
                          error={fieldState.error?.message}
                          disabled={isLoading}
                          leftSection={<GIcon name="At" size={16} />}
                        />
                      )}
                    />
                  </Group>

                  <Group grow>
                    <Controller
                      control={control}
                      name="country"
                      rules={{ required: 'Country is required' }}
                      render={({ field, fieldState }) => (
                        <Select
                          {...field}
                          renderOption={renderSelectOption}
                          data={countryOptions}
                          searchable
                          label="Country"
                          placeholder="Where do you live?"
                          withAsterisk
                          radius="md"
                          size="md"
                          disabled={isLoading}
                          error={fieldState.error?.message}
                          leftSection={<GIcon name="MapPin" size={16} />}
                        />
                      )}
                    />
                  </Group>

                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        minRows={4}
                        autosize
                        maxRows={8}
                        size="md"
                        disabled={isLoading}
                        label="About me"
                        placeholder="Share a bit about yourself, your interests, and what you're passionate about"
                        leftSection={<GIcon name="InfoCircle" size={16} />}
                      />
                    )}
                  />

                  {/* Social Media Section */}
                  <Box mt={16}>
                    <Divider
                      my="md"
                      label={<Text fw={500}>Social Media Links</Text>}
                      labelPosition="center"
                    />

                    {fields.map((field, index) => {
                      let icon = 'Link'
                      if (field.platform === 'twitter') icon = 'BrandTwitter'
                      if (field.platform === 'linkedin') icon = 'BrandLinkedin'
                      if (field.platform === 'github') icon = 'BrandGithub'

                      const isDefaultPlatform = index < 3

                      return (
                        <Group key={field.id} mt={16} align="flex-end">
                          {isDefaultPlatform ? (
                            <Controller
                              control={control}
                              name={`socialMediaRequests.${index}.platform`}
                              render={({ field: formField }) => (
                                <Select
                                  {...formField}
                                  label={index === 0 && 'Platform'}
                                  placeholder="Select platform"
                                  data={[
                                    { value: 'twitter', label: 'Twitter' },
                                    { value: 'linkedin', label: 'LinkedIn' },
                                    { value: 'github', label: 'GitHub' }
                                  ]}
                                  defaultValue={field.platform}
                                  size="md"
                                  radius="md"
                                  w="30%"
                                  leftSection={<GIcon name={icon} size={16} />}
                                  readOnly
                                />
                              )}
                            />
                          ) : (
                            <Controller
                              control={control}
                              name={`socialMediaRequests.${index}.platform`}
                              render={({ field }) => (
                                <TextInput
                                  {...field}
                                  placeholder="Enter platform name"
                                  size="md"
                                  radius="md"
                                  w="30%"
                                  leftSection={<GIcon name="Link" size={16} />}
                                />
                              )}
                            />
                          )}

                          <Controller
                            control={control}
                            name={`socialMediaRequests.${index}.url`}
                            render={({ field }) => (
                              <TextInput
                                {...field}
                                label={index === 0 && 'URL'}
                                placeholder={
                                  isDefaultPlatform
                                    ? `https://${watch(`socialMediaRequests.${index}.platform`)}.com/...`
                                    : 'https://example.com/...'
                                }
                                size="md"
                                radius="md"
                                w="60%"
                                leftSection={
                                  <GIcon
                                    name={isDefaultPlatform ? icon : 'Link'}
                                    size={16}
                                  />
                                }
                              />
                            )}
                          />

                          <ActionIcon
                            color="red"
                            onClick={() => remove(index)}
                            variant="subtle"
                            size="lg"
                            disabled={isDefaultPlatform}
                          >
                            <GIcon name="Trash" size={18} />
                          </ActionIcon>
                        </Group>
                      )
                    })}

                    {fields.length < 6 && (
                      <Button
                        mt={16}
                        variant="light"
                        color="indigo"
                        leftSection={<GIcon name="Plus" size={16} />}
                        onClick={addSocialMedia}
                        fullWidth
                      >
                        Add Custom Social Media Link ({6 - fields.length}{' '}
                        remaining)
                      </Button>
                    )}
                  </Box>

                  <Group justify="flex-end" mt={16}>
                    <Button
                      variant="subtle"
                      color="gray"
                      disabled={isLoading}
                      component={Link}
                      to="/me"
                      leftSection={<GIcon name="ArrowLeft" size={16} />}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={isLoading}
                      leftSection={
                        !isLoading && <GIcon name="DeviceFloppy" size={16} />
                      }
                      color="indigo"
                    >
                      Save Changes
                    </Button>
                  </Group>
                </Stack>
              </Box>
            </Flex>
          </form>
        </Stack>
      </Box>
    </AppLayout>
  )
}
