import { Box, Divider, FileInput, Tabs, Textarea } from '@mantine/core'
import { useFormContext } from 'react-hook-form'
import { GIcon } from '../common/GIcon'
import { CommentFormType } from '../../routes/post/$postId'
import { useMutation } from '@tanstack/react-query'
import { useCloudinary } from '../../hooks/useCloudinary'
import { mediaText } from '../../utils/mediatText'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export const CommentForm = () => {
  const {
    formState: { errors },
    register,
    setValue,
    getValues,
    watch
  } = useFormContext<CommentFormType>()

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

  return (
    <>
      <Tabs
        className="mt-2 rounded-lg border border-gray-200"
        defaultValue="write"
      >
        <Tabs.List className="">
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
          <Textarea
            w="100%"
            {...register('text', {
              required: { value: true, message: 'Content is required' }
            })}
            placeholder="What do you want to share?"
            minRows={8}
            error={errors.text?.message}
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
        </Tabs.Panel>

        <Tabs.Panel value="preview">
          <Box className="rounded-b-lg border-x border-b border-gray-300 p-8">
            <ReactMarkdown>{watch('text')}</ReactMarkdown>
          </Box>
        </Tabs.Panel>
      </Tabs>
    </>
  )
}
