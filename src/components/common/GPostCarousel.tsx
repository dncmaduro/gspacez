import { GMEdia, GMediaProps } from './GMedia'
import { Carousel } from '@mantine/carousel'
import { modals } from '@mantine/modals'

interface Props {
  medias: GMediaProps[]
}

export const GPostCarousel = ({ medias }: Props) => {
  console.log(medias)

  return (
    <Carousel>
      {medias.map((media, index) => (
        <Carousel.Slide
          key={index}
          mah={400}
          className="flex items-center justify-center"
          onClick={() =>
            modals.open({
              children: <GMEdia src={media.src} type={media.type} />
            })
          }
        >
          <GMEdia src={media.src} type={media.type} />
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}
