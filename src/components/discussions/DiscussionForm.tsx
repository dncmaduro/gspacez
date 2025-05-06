import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDiscussion } from '../../hooks/useDiscussion'
import { useMutation } from '@tanstack/react-query'
import { CreateDiscussionRequest } from '../../hooks/models'
import { GToast } from '../common/GToast'
import {
  Box,
  Button,
  Collapse,
  Divider,
  FileInput,
  Flex,
  Paper,
  Pill,
  PillGroup,
  Stack,
  Switch,
  Tabs,
  TagsInput,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import { GIcon } from '../common/GIcon'
import { useCloudinary } from '../../hooks/useCloudinary'
import { mediaText } from '../../utils/mediaText'
import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'

type DiscussionType = {
  title: string
  content: string
  voteRequest?: {
    title: string
    options: {
      value: string
    }[]
  }
  hashTags?: string[]
}

export const DiscussionForm = () => {
  const { createDiscussion } = useDiscussion()
  const { uploadMedia } = useCloudinary()
  const [fileValue, setFileValue] = useState<File | null>(null)

  const {
    control,
    register,
    formState: { errors },
    setValue,
    watch,
    getValues,
    handleSubmit
  } = useForm<DiscussionType>({
    defaultValues: {
      title: '',
      content: '',
      hashTags: []
    }
  })

  const {
    fields: voteOptions,
    append: appendVoteOption,
    remove: removeVoteOption
  } = useFieldArray({
    control,
    name: 'voteRequest.options'
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: ({ req }: { req: CreateDiscussionRequest }) =>
      createDiscussion(req),
    onSuccess: () => {
      GToast.success({
        title: 'Create discussion successfully!'
      })
    },
    onError: () => {
      GToast.error({
        title: 'Create discussion failed!'
      })
    }
  })

  const onSubmit = (values: DiscussionType) => {
    if (values.voteRequest) {
      create({
        req: {
          ...values,
          voteRequest: {
            title: values.voteRequest?.title,
            options: values.voteRequest?.options.map((option) => option.value)
          }
        }
      })
    } else {
      create({ req: { ...values, voteRequest: undefined } })
    }
  }

  const { mutate: upload, isPending: isPosting } = useMutation({
    mutationFn: ({ file, type }: { file: File; type: string }) =>
      uploadMedia(file, type),
    onSuccess: (response) => {
      setValue(
        'content',
        getValues('content') +
          mediaText(response.original_filename, response.secure_url)
      )
    }
  })

  const chooseFile = (file: File | null) => {
    if (file) {
      upload({ file, type: file.type.includes('image') ? 'image' : 'video' })
      setFileValue(null)
    }
  }

  const [useVote, { toggle }] = useDisclosure(false)

  useEffect(() => {
    if (!useVote) {
      setValue('voteRequest', undefined)
    }
  }, [useVote])

  return (
    <form className="mx-auto mt-8" onSubmit={handleSubmit(onSubmit)}>
      <Paper shadow="xs" p="md" radius="md" withBorder>
        <Stack gap={16}>
          <Controller
            control={control}
            name="title"
            rules={{ required: 'Title is required' }}
            render={({ field }) => {
              return (
                <TextInput
                  {...field}
                  placeholder="Your title"
                  size="md"
                  label="Discussion Title"
                  leftSection={<GIcon name="Message" size={20} />}
                />
              )
            }}
          />
          <Tabs defaultValue="write" bg={'white'}>
            <Tabs.List className="rounded-t-lg border border-gray-300">
              <Tabs.Tab
                value="write"
                leftSection={<GIcon name="Pencil" size={16} />}
              >
                Write
              </Tabs.Tab>
              <Tabs.Tab
                value="preview"
                leftSection={<GIcon name="Binoculars" size={16} />}
              >
                Preview
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="write">
              <Box className="rounded-b-lg border-x border-b border-gray-300">
                <Textarea
                  w="100%"
                  {...register('content', {
                    required: { value: true, message: 'Content is required' }
                  })}
                  error={errors.content?.message}
                  placeholder="What do you want to share?"
                  minRows={8}
                  autosize
                  radius="md"
                  disabled={isPosting}
                  styles={{
                    input: {
                      border: 'none'
                    }
                  }}
                />
                <Divider w="100%" h={2} />
                <Flex h={36}>
                  <FileInput
                    w={200}
                    size="sm"
                    radius="md"
                    placeholder="Upload media"
                    accept="image/*,video/*"
                    clearable
                    leftSection={<GIcon name="PhotoScan" size={18} />}
                    styles={{
                      input: {
                        border: 'none'
                      }
                    }}
                    onChange={chooseFile}
                    value={fileValue}
                  />
                  <Divider h="100%" orientation="vertical" w={1} />
                  <TagsInput
                    placeholder="Write your tags"
                    styles={{
                      input: {
                        border: 'none'
                      }
                    }}
                    value={watch('hashTags')}
                    size="sm"
                    className="grow"
                    onChange={(value) => setValue('hashTags', value)}
                    leftSection={<GIcon name="Hash" size={18} />}
                  />
                </Flex>
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="preview">
              <Box className="rounded-b-lg border-x border-b border-gray-300 p-8">
                <ReactMarkdown>{watch('content')}</ReactMarkdown>
                <PillGroup mt={8}>
                  {getValues('hashTags')?.map((tag, index) => {
                    return (
                      <Pill key={index} size="sm">
                        # {tag}
                      </Pill>
                    )
                  })}
                </PillGroup>
              </Box>
            </Tabs.Panel>
          </Tabs>

          <Switch
            label="Create a vote request"
            checked={useVote}
            onChange={toggle}
            mt={16}
          />

          <Collapse in={useVote}>
            <Controller
              control={control}
              name="voteRequest.title"
              render={({ field }) => {
                return (
                  <TextInput
                    {...field}
                    label="Vote request title"
                    placeholder="Your vote request title"
                    size="sm"
                    radius="md"
                  />
                )
              }}
            />

            <Text fw={500} size="sm" mt={12}>
              Options
            </Text>
            <Stack>
              {voteOptions.map((field, index) => (
                <Flex key={field.id} align="center" gap={8}>
                  <TextInput
                    {...register(`voteRequest.options.${index}.value`)}
                    placeholder="Option"
                    size="sm"
                    radius="md"
                    className="grow"
                  />
                  <Button
                    variant="subtle"
                    color="gray"
                    onClick={() => removeVoteOption(index)}
                  >
                    Remove
                  </Button>
                </Flex>
              ))}
            </Stack>

            <Button
              variant="light"
              color="indigo"
              size="xs"
              mt={12}
              leftSection={<GIcon name="Plus" size={16} />}
              onClick={() => appendVoteOption({ value: '' })}
            >
              Add Option
            </Button>
          </Collapse>

          <Button type="submit" loading={isCreating} mt={16}>
            Submit your new discussion
          </Button>
        </Stack>
      </Paper>
    </form>
  )
}
