import { useMutation } from '@tanstack/react-query'
import { useCloudinary } from '../../hooks/useCloudinary'
import { GImageCrop } from '../common/GImageCrop'
import { Dropzone } from '@mantine/dropzone'
import { useRef, useState } from 'react'
import { Box, Group, Text, Image, Divider, Button, Flex } from '@mantine/core'
import { GIcon } from '../common/GIcon'
import { GToast } from '../common/GToast'
import { modals } from '@mantine/modals'

interface Props {
  setValue: (url: string) => void
}

export const UploadAvatarModal = ({ setValue }: Props) => {
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
        title: 'Upload avatar successfully!'
      })
    },
    onError: () => {
      GToast.error({
        title: 'Upload avatar failed!'
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

  return (
    <>
      {image ? (
        <GImageCrop
          imageSrc={image}
          onSave={handleSaveCroppedImage}
        ></GImageCrop>
      ) : (
        <Dropzone onDrop={handleImageUpload} accept={['image/*']} maxFiles={1}>
          <Box
            className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-400"
            h={200}
            my={10}
            mx={10}
          >
            <Group>
              <GIcon name="Photo" size={24} color="gray" />
              <Text c="gray.8">Drop or click to choose image</Text>
            </Group>
          </Box>
        </Dropzone>
      )}
      {croppedImageFile && (
        <>
          <Divider color="gray" h={2} my={20} />
          <Group justify="center">
            <Text>Cropped avatar:</Text>
            <Image
              w={120}
              h={120}
              src={URL.createObjectURL(croppedImageFile)}
              className="!rounded-full border border-gray-300"
            />
          </Group>
          <Flex justify="center" align="center" mt={40} gap={16}>
            <Button onClick={onUpload} loading={isUploading}>
              Submit
            </Button>
            <Dropzone
              openRef={openRef}
              onDrop={handleImageUpload}
              accept={['image/*']}
              maxFiles={1}
            >
              <Button
                disabled={isUploading}
                onClick={() => openRef.current?.()}
                variant="light"
              >
                Or upload another photo
              </Button>
            </Dropzone>
          </Flex>
        </>
      )}
    </>
  )
}
