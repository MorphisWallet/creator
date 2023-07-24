import { useState } from 'react'
import { Dropzone, type DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useUploadImage } from '@/hooks/useUploadImage'
import { useDidUpdate } from '@mantine/hooks'
import { ActionIcon, Box, Center, Group, Image, SimpleGrid, Space, Stack, Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { DropZoneStateIcon } from '@/components/project/DropZoneStateIcon'

type Props = {
  onImageUrlChange: (url: string[]) => void
  initialImageUrls: string[]
}

export const PreviewImage = ({ onImageUrlChange, initialImageUrls }: Props) => {
  const [imageUrls, setImageUrls] = useState(initialImageUrls ?? [])

  const { upload, loading, imageUrl } = useUploadImage()

  useDidUpdate(() => {
    appendImage(imageUrl)
  }, [imageUrl])

  const onDrop: DropzoneProps['onDrop'] = files => {
    const file = files[0]
    if (!file) return
    upload(file)
  }

  const removeImage = (url: string) => {
    const newImageUrls = imageUrls.filter(imageUrl => imageUrl !== url)
    setImageUrls(newImageUrls)
    onImageUrlChange(newImageUrls)
  }

  const appendImage = (url: string) => {
    const newImageUrls = [...imageUrls, url]
    setImageUrls(newImageUrls)
    onImageUrlChange(newImageUrls)
  }

  return (
    <Box>
      <Group position={'apart'}>
        <Text
          fw={500}
          size="sm"
          mb={4}
        >
          Preview image
        </Text>
        <Text
          fw={500}
          size="sm"
          mb={4}
          color={'dimmed'}
        >
          {imageUrls.length} / 10
        </Text>
      </Group>
      <Dropzone
        onDrop={onDrop}
        onReject={files => {
          notifications.show({
            title: 'Error',
            message: files[0]?.errors[0]?.message ?? 'Invalid File',
            color: 'red',
          })
        }}
        maxSize={3 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        maxFiles={1}
        sx={{
          borderStyle: 'solid',
          borderWidth: '1px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 420,
        }}
        loading={loading}
      >
        <Stack sx={{ pointerEvents: 'none' }}>
          <DropZoneStateIcon />
          <Box>
            <Center>
              <Text color={'dimmed'}>1400 x 420 recommended</Text>
            </Center>
            <Center>
              <Text color={'dimmed'}>One Image minimum</Text>
            </Center>
          </Box>
        </Stack>
      </Dropzone>
      <Space h={'md'} />
      <SimpleGrid
        cols={3}
        spacing="lg"
      >
        {imageUrls.map((url, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              overflow: 'hidden',
            }}
            h={200}
          >
            <Image
              src={url}
              alt="preview"
              fit="cover"
              height={200}
              width={'100%'}
              radius={'md'}
            />
            <ActionIcon
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              onClick={() => removeImage(url)}
            >
              <IconX />
            </ActionIcon>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}
