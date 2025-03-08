import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Box,
  Button,
  Collapse,
  Radio,
  Stack,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { Controller, useForm } from 'react-hook-form'
import { useDisclosure } from '@mantine/hooks'

export const Route = createFileRoute('/squad/new')({
  component: RouteComponent
})

export interface CreateSquadType {
  name: string
  tagName: string
  description: string
  type: 'public' | 'private'
}

function RouteComponent() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateSquadType>({
    defaultValues: {}
  })

  const [opened, { toggle }] = useDisclosure(false)

  const onSubmit = (values: CreateSquadType) => {
    console.log(values)
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
              rules={{ required: true }}
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
                  />
                )
              }}
            />
            <Controller
              control={control}
              rules={{ required: true }}
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
                    error={errors.tagName?.message}
                  />
                )
              }}
            />
            <Controller
              control={control}
              name="description"
              rules={{ required: true }}
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
                    error={errors.description?.message}
                  />
                )
              }}
            />
            <Controller
              control={control}
              name="type"
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
              size="md"
              color="gray"
              onClick={() => toggle()}
              variant="default"
              rightSection={
                <GIcon name={opened ? 'ChevronUp' : 'ChevronDown'} size={16} />
              }
            >
              Advanced settings (Coming soon)
            </Button>
            <Collapse in={opened}>Advanced settings</Collapse>
            <Button type="submit">Submit your new squad</Button>
          </Stack>
        </form>
      </Box>
    </AppLayout>
  )
}
