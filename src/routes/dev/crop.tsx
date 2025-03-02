import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Dropzone } from '@mantine/dropzone'
import { useState } from 'react'
import { Text, Image } from '@mantine/core'
import { GImageCrop } from '../../components/common/GImageCrop'

export const Route = createFileRoute('/dev/crop')({
  component: RouteComponent
})

function RouteComponent() {
  const [image, setImage] = useState<string | null>(null)
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null)

  const handleImageUpload = (files: File[]) => {
    const file = files[0]
    setImage(URL.createObjectURL(file))
  }

  const handleSaveCroppedImage = (file: File) => {
    setCroppedImageFile(file)
    console.log('Ảnh đã crop:', file)
  }

  return (
    <AppLayout>
      {!image && (
        <Dropzone onDrop={handleImageUpload} accept={['image/*']} maxFiles={1}>
          <Text>Kéo thả hoặc nhấn để chọn ảnh</Text>
        </Dropzone>
      )}
      {image && <GImageCrop imageSrc={image} onSave={handleSaveCroppedImage} />}
      {croppedImageFile && (
        <div>
          <Text>Ảnh đã crop:</Text>
          <Image src={URL.createObjectURL(croppedImageFile)} />
        </div>
      )}
    </AppLayout>
  )
}
