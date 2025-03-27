import {
  Box,
  Divider,
  FileInput,
  Flex,
  Group,
  Pill,
  PillGroup,
  Select,
  SelectProps,
  Stack,
  Tabs,
  TagsInput,
  Textarea,
  TextInput
} from '@mantine/core'
import { useFormContext } from 'react-hook-form'
import { PostFormType } from '../../routes/post/new'
import { GIcon } from '../common/GIcon'
import { useCloudinary } from '../../hooks/useCloudinary'
import { useMutation } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { mediaText } from '../../utils/mediaText'
import ReactMarkdown from 'react-markdown'

export const PostForm = () => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch
  } = useFormContext<PostFormType>()

  const { uploadMedia } = useCloudinary()

  const { mutate: upload, isPending: isPosting } = useMutation({
    mutationFn: ({ file, type }: { file: File; type: string }) =>
      uploadMedia(file, type),
    onSuccess: (response) => {
      setValue(
        'text',
        getValues('text') +
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

  const [fileValue, setFileValue] = useState<File | null>(null)

  const privacyOptions = [
    {
      label: 'Public',
      value: 'PUBLIC'
    },
    {
      label: 'Private',
      value: 'PRIVATE'
    }
  ]

  const privacyIcons: Record<string, ReactNode> = {
    PUBLIC: <GIcon name="World" size={16} />,
    PRIVATE: <GIcon name="LockFilled" size={16} />
  }

  const RenderOption: SelectProps['renderOption'] = ({ option, checked }) => {
    return (
      <Group>
        {privacyIcons[option.value]}
        {option.label}
        {checked && <GIcon name="Check" size={20} color="gray" />}
      </Group>
    )
  }

  return (
    <Stack gap={24}>
      <Flex justify="space-between" gap={16}>
        <TextInput
          w="75%"
          {...register('title', {
            required: { value: true, message: 'Title is required' }
          })}
          error={errors.title?.message}
          placeholder="Your title"
          size="md"
          label="Title"
          radius="md"
        />
        <Select
          data={privacyOptions}
          onChange={(value) => setValue('privacy', value || 'PUBLIC')}
          value={watch('privacy')}
          defaultValue={'PUBLIC'}
          allowDeselect={false}
          renderOption={RenderOption}
          label="Choose your post privacy"
          radius="md"
          size="md"
          className="grow"
        />
      </Flex>
      <Tabs defaultValue="write">
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
              {...register('text', {
                required: { value: true, message: 'Content is required' }
              })}
              error={errors.text?.message}
              placeholder="What do you want to share?"
              minRows={8}
              autosize
              radius="md"
              size="md"
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
            <ReactMarkdown>{watch('text')}</ReactMarkdown>
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
    </Stack>
  )
}
