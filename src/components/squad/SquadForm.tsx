import {
  Box,
  Button,
  Collapse,
  Flex,
  Image,
  Radio,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import { GIcon } from '../common/GIcon'
import { useMutation } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useSquad } from '../../hooks/useSquad'
import { RootState } from '../../store/store'
import { CreateSquadRequest, UpdateSquadRequest } from '../../hooks/models'
import { GToast } from '../common/GToast'
import { useDisclosure } from '@mantine/hooks'
import { ISquad } from '../../hooks/interface'
import { UploadAvatarModal } from '../profile/UploadAvatarModal'
import { modals } from '@mantine/modals'
import { useNavigate } from '@tanstack/react-router'

export interface SquadType {
  name: string
  tagName: string
  description: string
  privacy: 'public' | 'private'
  avatarUrl: string
  setting: {
    allowPostModeration: boolean
    allowChangeProfileAccessibility: boolean
    allowPostInteraction: boolean
  }
}

interface Props {
  squad?: ISquad
}

export const SquadForm = ({ squad }: Props) => {
  const navigate = useNavigate()
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch
  } = useForm<SquadType>({
    defaultValues: squad
      ? {
          ...squad,
          privacy: squad.privacy as 'public' | 'private'
        }
      : { privacy: 'public' }
  })

  const { createSquad, updateSquad } = useSquad()
  const token = useSelector((state: RootState) => state.auth.token)

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: ['create-squad'],
    mutationFn: ({ req }: { req: CreateSquadRequest }) =>
      createSquad(req, token),
    onSuccess: (response) => {
      GToast.success({
        title: 'Create squad successfully!'
      })
      navigate({ to: `/squad/${response.data.result.tagName}` })
    },
    onError: () => {
      GToast.error({
        title: 'Create squad failed!'
      })
    }
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: ['create-squad'],
    mutationFn: ({
      req,
      tagName
    }: {
      req: UpdateSquadRequest
      tagName: string
    }) => updateSquad(tagName, req, token),
    onSuccess: (response) => {
      GToast.success({
        title: 'Update squad successfully!'
      })
      navigate({ to: `/squad/${response.data.result.tagName}` })
    },
    onError: () => {
      GToast.error({
        title: 'Update squad failed!'
      })
    }
  })

  const [opened, { toggle }] = useDisclosure(false)

  const onSubmit = (values: SquadType) => {
    if (!squad) {
      create({
        req: values
      })
    } else {
      update({
        tagName: squad.tagName,
        req: {
          ...values
        }
      })
    }
  }

  const privacyOptions = [
    {
      value: 'public',
      label: 'Public',
      description:
        'Everyone can see all posts in your squad. They also can interact based on each post settings.'
    },
    {
      value: 'private',
      label: 'Private',
      description:
        'Only members in the squads can interact with posts. Members can also send invitation link to join the squad.'
    }
  ]

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
    <form className="mx-auto mt-8" onSubmit={handleSubmit(onSubmit)}>
      <Stack w={800} mx="auto">
        <Flex gap={16}>
          <Stack className="grow">
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Name is required' }}
              render={({ field }) => {
                return (
                  <TextInput
                    {...field}
                    size="md"
                    label="Name of your squad"
                    placeholder="Your squad's name"
                    leftSection={<GIcon name="Label" size={20} />}
                    withAsterisk
                    radius="md"
                    error={errors.name?.message}
                    className="grow"
                  />
                )
              }}
            />
            <Controller
              control={control}
              rules={{ required: 'Tag name is required' }}
              name="tagName"
              render={({ field }) => {
                return (
                  <TextInput
                    {...field}
                    size="md"
                    label="Tag name"
                    placeholder="Find a tag name that can impress everyone"
                    withAsterisk
                    leftSection={<GIcon name="At" size={20} />}
                    radius="md"
                    error={errors.tagName?.message} // Display error message
                  />
                )
              }}
            />
            <Controller
              control={control}
              name="description"
              render={({ field }) => {
                return (
                  <Textarea
                    {...field}
                    size="md"
                    label="Description"
                    placeholder="To help people know what your group will do"
                    withAsterisk
                    minRows={4}
                    autosize
                    radius="md"
                  />
                )
              }}
            />
          </Stack>
          <Box w={200}>
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
                  onClick={
                    !isCreating && !isUpdating
                      ? openUploadAvatarModal
                      : undefined
                  }
                  className="flex cursor-pointer items-center justify-center rounded-full border-1 border-gray-400 hover:bg-gray-50"
                >
                  <GIcon name="Photo" size={24} color="gray" />
                </Box>
              )}
              <Button
                size="xs"
                variant="default"
                onClick={openUploadAvatarModal}
                disabled={isCreating || isUpdating}
              >
                Upload new avatar
              </Button>
            </Flex>
          </Box>
        </Flex>
        <Controller
          control={control}
          name="privacy"
          render={({ field }) => {
            return (
              <>
                <Text className="!font-medium" mt={8}>
                  Choose your squad's privacy
                </Text>
                <Radio.Group {...field} defaultValue="public">
                  <Stack gap={24}>
                    {privacyOptions.map((option) => (
                      <Radio
                        label={option.label}
                        description={option.description}
                        value={option.value}
                        key={option.value}
                      />
                    ))}
                  </Stack>
                </Radio.Group>
              </>
            )
          }}
        />
        <Button
          size="sm"
          color="gray"
          onClick={() => toggle()}
          variant="default"
          leftSection={<GIcon name="Settings" size={16} />}
          rightSection={
            <GIcon name={opened ? 'ChevronUp' : 'ChevronDown'} size={16} />
          }
        >
          Advanced settings (Coming soon)
        </Button>
        <Collapse in={opened}>
          <Stack gap={24} mt={16}>
            <Controller
              control={control}
              name="setting.allowChangeProfileAccessibility"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  label="Allow change profile accessibility"
                  description="Allow user can change who can view his/her post. There are 2 modes: For Only Admins and For Everyone."
                />
              )}
            />
            <Controller
              control={control}
              name="setting.allowPostInteraction"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  label="Allow change post interaction"
                  description="Allow user can manage whether user can interact with his/her post."
                />
              )}
            />
            <Controller
              control={control}
              name="setting.allowPostModeration"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  label="Allow post under moderation"
                  description="Allow moderator can accept or deny any post that members want to create."
                />
              )}
            />
          </Stack>
        </Collapse>

        <Button type="submit" mt={32} loading={isCreating || isUpdating}>
          Submit your new squad
        </Button>
      </Stack>
    </form>
  )
}
