import { useState } from 'react'
import { Dropzone, type DropzoneProps, type FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { ActionIcon, Box, Center, Image, LoadingOverlay, Stack, Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useUploadImage } from '@/hooks/useUploadImage'
import { useDidUpdate } from '@mantine/hooks'
import { DropZoneStateIcon } from '@/components/project/DropZoneStateIcon'

type Props = {
  onImageUrlChange: (url: string) => void
  initialImageUrl: string
}

export const BannerImage = ({ onImageUrlChange, initialImageUrl }: Props) => {
  const [files, setFiles] = useState<FileWithPath[]>([])
  const clearFiles = () => {
    setFiles([])
    onImageUrlChange('')
  }

  const { upload, loading, imageUrl } = useUploadImage()

  useDidUpdate(() => {
    onImageUrlChange(imageUrl)
  }, [imageUrl])

  const onDrop: DropzoneProps['onDrop'] = files => {
    setFiles(files)
    const file = files[0]
    if (!file) return
    upload(file)
  }

  if ((files.length >= 1 && files[0]) || initialImageUrl) {
    let imageUrl = initialImageUrl
    if (files.length >= 1 && files[0]) {
      imageUrl = URL.createObjectURL(files[0])
    }

    return (
      <Box>
        <Text
          fw={500}
          size="sm"
          mb={4}
        >
          Banner image
        </Text>
        <Box sx={{ position: 'relative' }}>
          <LoadingOverlay
            visible={loading}
            overlayBlur={2}
          />
          <Image
            src={imageUrl}
            fit={'cover'}
            height={420}
            alt={'Project Banner Image'}
          />
          <ActionIcon
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            onClick={clearFiles}
          >
            <IconX />
          </ActionIcon>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Text
        fw={500}
        size="sm"
        mb={4}
      >
        Banner image
      </Text>
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
      >
        <Stack sx={{ pointerEvents: 'none' }}>
          <DropZoneStateIcon />
          <Center>
            <Text color={'dimmed'}>1400 x 420 recommended</Text>
          </Center>
        </Stack>
      </Dropzone>
    </Box>
  )
}
