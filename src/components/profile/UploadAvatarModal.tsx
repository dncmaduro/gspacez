import { useMutation } from '@tanstack/react-query'
import { useCloudinary } from '../../hooks/useCloudinary'
import { GImageCrop } from '../common/GImageCrop'
import { Dropzone } from '@mantine/dropzone'
import { useRef, useState } from 'react'
import {
  Box,
  Group,
  Text,
  Image,
  Divider,
  Button,
  Flex,
  Paper,
  Title,
  ActionIcon,
  Tooltip
} from '@mantine/core'
import { GIcon } from '../common/GIcon'
import { GToast } from '../common/GToast'
import { modals } from '@mantine/modals'

interface Props {
  setValue: (url: string) => void
  currentAvatar?: string
}

export const UploadAvatarModal = ({ setValue, currentAvatar }: Props) => {
  const [image, setImage] = useState<string | null>(null)
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null)
  const openRef = useRef<() => void>(null)

  const handleImageUpload = (files: File[]) => {
    const file = files[0]
    setImage(URL.createObjectURL(file))
  }

  const { uploadMedia } = useCloudinary()

  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationKey: ['upload-avatar'],
    mutationFn: (file: File) => uploadMedia(file, 'image'),
    onSuccess: (response) => {
      setValue(response.secure_url)
      modals.closeAll()
      GToast.success({
        title: 'Avatar updated successfully!'
      })
    },
    onError: () => {
      GToast.error({
        title: 'Failed to update avatar'
      })
    }
  })

  const handleSaveCroppedImage = (file: File) => {
    setCroppedImageFile(file)
  }

  const onUpload = () => {
    if (croppedImageFile) {
      uploadImage(croppedImageFile)
    }
  }

  const resetImage = () => {
    setImage(null)
    setCroppedImageFile(null)
  }

  return (
    <Paper p="md" radius="md" withBorder className="bg-white shadow-sm">
      <Title order={4} className="mb-4 text-center text-indigo-800">
        Update Profile Picture
      </Title>

      {image ? (
        <>
          <GImageCrop imageSrc={image} onSave={handleSaveCroppedImage} />
          <Tooltip label="Choose another image">
            <ActionIcon
              className="absolute top-2 right-2"
              color="indigo"
              variant="light"
              onClick={resetImage}
            >
              <GIcon name="ArrowBack" size={18} />
            </ActionIcon>
          </Tooltip>
        </>
      ) : (
        <Box className="p-2">
          {currentAvatar && (
            <Flex direction="column" align="center" mb={20}>
              <Text size="sm" c="dimmed" mb={10}>
                Current Avatar
              </Text>
              <Image
                src={currentAvatar}
                w={100}
                h={100}
                className="rounded-full border-2 border-indigo-300 shadow-sm"
              />
            </Flex>
          )}

          <Dropzone
            onDrop={handleImageUpload}
            accept={['image/*']}
            maxFiles={1}
            className="border-2 border-dashed border-indigo-300 transition-colors hover:border-indigo-500"
          >
            <Box
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg"
              h={180}
              my={10}
              mx={10}
            >
              <GIcon name="Photo" size={40} color="indigo" />
              <Text c="indigo.8" fw={500} mt={10}>
                Drop image here or click to browse
              </Text>
              <Text size="xs" c="dimmed" mt={5}>
                Recommended: Square image, at least 400x400 pixels
              </Text>
            </Box>
          </Dropzone>
        </Box>
      )}

      {croppedImageFile && (
        <>
          <Divider color="gray.3" my={20} />
          <Box className="rounded-lg bg-gray-50 p-4">
            <Text fw={500} className="mb-3 text-center">
              Preview
            </Text>
            <Flex justify="center">
              <Image
                w={120}
                h={120}
                src={URL.createObjectURL(croppedImageFile)}
                className="rounded-full border-2 border-indigo-300 shadow-md transition-all hover:border-indigo-500"
              />
            </Flex>

            <Flex justify="center" align="center" mt={20} gap={16}>
              <Button
                onClick={onUpload}
                loading={isUploading}
                leftSection={<GIcon name="Check" size={16} />}
                color="indigo"
              >
                Save Avatar
              </Button>
              <Dropzone
                openRef={openRef}
                onDrop={handleImageUpload}
                accept={['image/*']}
                maxFiles={1}
                className="hidden"
              >
                <Button
                  disabled={isUploading}
                  onClick={() => openRef.current?.()}
                  variant="light"
                  leftSection={<GIcon name="Photo" size={16} />}
                >
                  Choose Another
                </Button>
              </Dropzone>
            </Flex>
          </Box>
        </>
      )}
    </Paper>
  )
}
