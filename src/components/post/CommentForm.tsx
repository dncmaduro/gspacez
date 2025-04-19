import {
  Box,
  Divider,
  FileInput,
  Tabs,
  Textarea,
  Group,
  Text
} from '@mantine/core'
import { useFormContext } from 'react-hook-form'
import { GIcon } from '../common/GIcon'
import { CommentFormType } from '../../routes/post/$postId'
import { useMutation } from '@tanstack/react-query'
import { useCloudinary } from '../../hooks/useCloudinary'
import { mediaText } from '../../utils/mediaText'
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
  const [activeTab, setActiveTab] = useState<string | null>('write')

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
  const commentText = watch('text')

  return (
    <Box className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        className="overflow-hidden rounded-lg"
      >
        <Tabs.List className="bg-gray-50">
          <Tabs.Tab
            value="write"
            leftSection={<GIcon name="Pencil" size={16} />}
            className="font-medium transition-colors duration-200 hover:bg-indigo-50"
          >
            Write
          </Tabs.Tab>
          <Tabs.Tab
            value="preview"
            leftSection={<GIcon name="Binoculars" size={16} />}
            className="font-medium transition-colors duration-200 hover:bg-indigo-50"
            disabled={!commentText}
          >
            Preview
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="write" className="p-2">
          <Textarea
            id="comment-textarea"
            w="100%"
            {...register('text', {
              required: { value: true, message: 'Content is required' }
            })}
            placeholder="What do you want to share?"
            minRows={4}
            error={errors.text?.message}
            autosize
            radius="md"
            size="md"
            disabled={isPosting}
            styles={{
              input: {
                border: 'none',
                padding: '12px',
                fontSize: '15px',
                backgroundColor: 'white'
              }
            }}
          />

          <Divider my="xs" />

          <Group justify="space-between" p="xs">
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
                  border: '1px solid #E5E7EB',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#818CF8'
                  }
                }
              }}
              onChange={chooseFile}
              value={fileValue}
              disabled={isPosting}
            />

            {isPosting && (
              <Text size="sm" c="dimmed">
                Uploading media...
              </Text>
            )}
          </Group>
        </Tabs.Panel>

        <Tabs.Panel value="preview">
          <Box className="min-h-[150px] rounded-b-lg p-6">
            {commentText ? (
              <ReactMarkdown className="prose prose-indigo max-w-none">
                {commentText}
              </ReactMarkdown>
            ) : (
              <Text c="dimmed" ta="center" pt="md">
                Nothing to preview yet
              </Text>
            )}
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}
