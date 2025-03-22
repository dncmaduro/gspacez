import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Box,
  Button,
  Collapse,
  Radio,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { Controller, useForm } from 'react-hook-form'
import { useDisclosure } from '@mantine/hooks'
import { useSquad } from '../../hooks/useSquad'
import { useMutation } from '@tanstack/react-query'
import { CreateSquadRequest } from '../../hooks/models'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { GToast } from '../../components/common/GToast'

export const Route = createFileRoute('/squad/new')({
  component: RouteComponent
})

export interface CreateSquadType {
  name: string
  tagName: string
  description: string
  privacy: 'public' | 'private'
  setting: {
    allowPostModeration: boolean
    allowChangeProfileAccessibility: boolean
    allowPostInteraction: boolean
  }
}

function RouteComponent() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateSquadType>({
    defaultValues: {
      privacy: 'public'
    },
    mode: 'onSubmit' // Ensure validation runs on form submission
  })

  const { createSquad } = useSquad()
  const token = useSelector((state: RootState) => state.auth.token)

  const { mutate: create, isPending } = useMutation({
    mutationKey: ['create-squad'],
    mutationFn: ({ req }: { req: CreateSquadRequest }) =>
      createSquad(req, token),
    onSuccess: () => {
      GToast.success({
        title: 'Create squad successfully!'
      })
    },
    onError: () => {
      GToast.error({
        title: 'Create squad failed!'
      })
    }
  })

  const [opened, { toggle }] = useDisclosure(false)

  const onSubmit = (values: CreateSquadType) => {
    create({
      req: values
    })
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

  return (
    <AppLayout>
      <Box maw={1000} mx="auto" px={32} py={20}>
        <Stack align="center">
          <Text className="!text-4xl !font-bold">Create squad</Text>
          <Text className="!text-lg">
            Create a place that people can interact with others about a topic
          </Text>
        </Stack>
        <form className="mx-auto mt-8" onSubmit={handleSubmit(onSubmit)}>
          <Stack w={600} mx="auto">
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
                    error={errors.name?.message} // Display error message
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

            <Button type="submit" mt={32} loading={isPending}>
              Submit your new squad
            </Button>
          </Stack>
        </form>
      </Box>
    </AppLayout>
  )
}
