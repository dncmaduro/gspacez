import { useState, useCallback } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Slider, Button, Group } from '@mantine/core'
import getCroppedImg from '../../utils/cropper'

interface ImageCropProps {
  imageSrc: string
  // eslint-disable-next-line
  onSave: (file: File) => void
}

export const GImageCrop: React.FC<ImageCropProps> = ({ imageSrc, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCrop = async () => {
    if (!croppedAreaPixels) return
    const file = await getCroppedImg(imageSrc, croppedAreaPixels)
    setCroppedFile(file)
  }

  const handleSave = () => {
    if (croppedFile) onSave(croppedFile)
  }

  return (
    <div className="relative h-[400px] w-full bg-gray-900">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform flex-col items-center gap-2">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={setZoom}
          className="w-60"
        />
        <Group>
          <Button onClick={handleCrop}>Cắt ảnh</Button>
          {croppedFile && (
            <Button color="green" onClick={handleSave}>
              Lưu
            </Button>
          )}
        </Group>
      </div>
    </div>
  )
}
