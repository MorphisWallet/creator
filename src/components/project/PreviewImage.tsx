import { useState } from 'react'
import { Dropzone, type DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useUploadImage } from '@/hooks/useUploadImage'
import { useDidUpdate } from '@mantine/hooks'
import { Box, Center, Image, SimpleGrid, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { DropZoneStateIcon } from '@/components/project/DropZoneStateIcon'
import { CloseButton } from '@/components/project/CloseButton'

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
          borderRadius: 16,
        }}
        loading={loading}
      >
        <Stack sx={{ pointerEvents: 'none' }}>
          <DropZoneStateIcon />
          <Box>
            <Center>
              <Text color={'dimmed'}>640 x 480 recommended</Text>
            </Center>
          </Box>
        </Stack>
      </Dropzone>
      <SimpleGrid
        cols={3}
        spacing={8}
        mt={8}
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
              radius={16}
            />
            <CloseButton onClick={() => removeImage(url)} />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}
