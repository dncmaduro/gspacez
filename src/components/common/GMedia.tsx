import { Image } from '@mantine/core'

export interface GMediaProps {
  src: string
  type: 'video' | 'image'
}

export const GMEdia = ({ src, type }: GMediaProps) => {
  if (type === 'video') {
    return <video src={src} />
  }

  return <Image src={src} />
}
