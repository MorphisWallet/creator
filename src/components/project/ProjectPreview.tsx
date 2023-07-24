import { Card, Image, Skeleton, Text } from '@mantine/core'
import { Carousel } from '@mantine/carousel'

type Props = {
  bannerImage: string
  logoUrl: string
  name: string
  previewImages: string[]
}

export const ProjectPreview = ({ bannerImage, logoUrl, previewImages, name }: Props) => {
  const placeholderImages = Array.from({ length: 5 }, () => '')
  const imageForCarousel = previewImages?.length > 0 ? previewImages : placeholderImages

  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
    >
      <Text>Preview 👀</Text>
      <Image
        src={bannerImage}
        height={280}
        fit={'cover'}
        alt={'Project banner image'}
        withPlaceholder
        mt={'md'}
      />
      <Image
        src={logoUrl}
        height={94}
        width={94}
        alt={'logo'}
        radius={'50%'}
        withPlaceholder
        ml={'xl'}
        sx={{ position: 'relative', top: -42, marginBottom: -32 }}
      />
      <Skeleton
        visible={!name}
        animate={false}
        w={150}
      >
        <Text>{name || 'placeholder'}</Text>
      </Skeleton>

      <Carousel
        mx="auto"
        withIndicators={false}
        height={200}
        slideGap="md"
        slideSize="40%"
        align="start"
        dragFree
        mt={'md'}
        withControls={false}
        sx={{
          cursor: 'grab',
        }}
      >
        {imageForCarousel.map((image, index) => (
          <Carousel.Slide key={index}>
            <Image
              src={image}
              height={200}
              fit={'cover'}
              alt={'Project preview image'}
              withPlaceholder
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Card>
  )
}
