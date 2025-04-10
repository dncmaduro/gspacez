import {
  Avatar,
  Box,
  Divider,
  FileInput,
  Flex,
  Group,
  Image,
  Loader,
  Pill,
  PillGroup,
  Select,
  SelectProps,
  Stack,
  Tabs,
  TagsInput,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import { Controller, useFormContext } from 'react-hook-form'
import { PostFormType } from '../../routes/post/new'
import { GIcon } from '../common/GIcon'
import { useCloudinary } from '../../hooks/useCloudinary'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ReactNode, useMemo, useState } from 'react'
import { mediaText } from '../../utils/mediaText'
import ReactMarkdown from 'react-markdown'
import { useProfile } from '../../hooks/useProfile'
import { useMe } from '../../hooks/useMe'

export const PostForm = () => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
    control
  } = useFormContext<PostFormType>()

  const { uploadMedia } = useCloudinary()
  const { getJoinedSquads } = useProfile()
  const { data: meData } = useMe()

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

  const { mutate: uploadPreview, isPending: isPostingPreview } = useMutation({
    mutationFn: ({ file, type }: { file: File; type: string }) =>
      uploadMedia(file, type),
    onSuccess: (response) => {
      setValue('previewImage', response.secure_url)
    }
  })

  const { data: squadData } = useQuery({
    queryKey: ['get-joined-squads'],
    queryFn: () => getJoinedSquads(meData?.id || ''),
    select: (data) => {
      return data.data.result.map((squad) => ({
        value: squad.tagName,
        label: squad.name,
        ...squad
      }))
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

  const PrivacyRenderOption: SelectProps['renderOption'] = ({
    option,
    checked
  }) => {
    return (
      <Group>
        {privacyIcons[option.value]}
        {option.label}
        {checked && <GIcon name="Check" size={20} color="gray" />}
      </Group>
    )
  }

  const squadByTagName = useMemo(() => {
    if (!squadData) return {}

    return squadData?.reduce(
      (acc, squad) => {
        return { ...acc, [squad.tagName]: squad }
      },
      {} as Record<string, (typeof squadData)[0]>
    )
  }, [squadData])

  const SquadRenderOption: SelectProps['renderOption'] = ({ option }) => {
    return (
      <Group>
        <Avatar
          src={squadByTagName[option.value].avatarUrl}
          className="border border-gray-200"
        />
        <Stack gap={0}>
          <Text>{squadByTagName[option.value].name}</Text>
          <Text size="sm" c="dimmed">
            {squadByTagName[option.value].tagName}
          </Text>
        </Stack>
      </Group>
    )
  }

  const handleUploadPreviewImage = (file: File | null) => {
    if (file) {
      uploadPreview({ file, type: 'image' })
    }
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
          label="Title"
          radius="md"
        />
        <Select
          data={privacyOptions}
          onChange={(value) => setValue('privacy', value || 'PUBLIC')}
          value={watch('privacy')}
          defaultValue={'PUBLIC'}
          allowDeselect={false}
          renderOption={PrivacyRenderOption}
          label="Choose your post privacy"
          radius="md"
          className="grow"
        />
      </Flex>
      <Controller
        control={control}
        name="squadTagName"
        render={({ field }) => (
          <Select
            data={squadData || []}
            defaultValue={''}
            allowDeselect={false}
            label="Choose your squad"
            radius="md"
            renderOption={SquadRenderOption}
            className="grow"
            placeholder="Choose your squad you want to post on"
            {...field}
          />
        )}
      />
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

      <Controller
        control={control}
        name="previewImage"
        render={() => {
          return (
            <Stack>
              <FileInput
                accept="image/*"
                label="Preview image"
                radius={'md'}
                placeholder="Choose your preview image"
                onChange={(file) => handleUploadPreviewImage(file)}
              />
              {isPostingPreview ? (
                <Loader mx={'auto'} />
              ) : watch('previewImage') ? (
                <Image src={watch('previewImage')} />
              ) : (
                <Box
                  className="flex items-center justify-center rounded-lg border border-dashed border-gray-400"
                  h={200}
                >
                  <Group gap={8}>
                    <GIcon name="Photo" size={28} color="gray" />
                    <Text c="dimmed" size="sm">
                      Your preview image goes here
                    </Text>
                  </Group>
                </Box>
              )}
            </Stack>
          )
        }}
      />
    </Stack>
  )
}
