import { useState } from 'react'
import { Dropzone, type DropzoneProps, type FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { ActionIcon, Box, Group, Image, rem, Text } from '@mantine/core'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { api } from '@/utils/api'

type Props = {
  onSuccessUpload?: (url: string) => void
}

export const FeaturedImage = ({ onSuccessUpload }: Props) => {
  const [files, setFiles] = useState<FileWithPath[]>([])
  const clearFiles = () => setFiles([])
  const [isUploading, setIsUploading] = useState(false)

  const { mutate, isLoading } = api.upload.getUploadUrl.useMutation({
    onSuccess: async ({ uploadUrl, imageUrl }) => {
      try {
        const file = files[0]
        if (!file) return
        setIsUploading(true)
        const upload = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })

        if (upload.ok) {
          onSuccessUpload?.(imageUrl)
        } else {
          notifications.show({
            title: 'Error',
            message: 'Failed to upload image',
            color: 'red',
          })
        }
        setIsUploading(false)
      } catch (e) {
        notifications.show({
          title: 'Error',
          message: 'Failed to upload image',
          color: 'red',
        })
      }
    },
  })

  const loading = isLoading || isUploading

  const onDrop: DropzoneProps['onDrop'] = files => {
    setFiles(files)
    const file = files[0]
    if (!file) return
    const extension = file.name.split('.').pop()
    if (!extension) return
    mutate({ extension })
  }

  if (files.length >= 1 && files[0]) {
    const imageUrl = URL.createObjectURL(files[0])
    return (
      <Box>
        <p>Featured image</p>
        <Box sx={{ position: 'relative' }}>
          <Image
            src={imageUrl}
            fit={'cover'}
            height={420}
            alt={'Perk Feature Image'}
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
        mb={2}
      >
        Featured image
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
        loading={loading}
      >
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: rem(220), pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <IconUpload
              size="3.2rem"
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              size="3.2rem"
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              size="3.2rem"
              stroke={1.5}
            />
          </Dropzone.Idle>
          <div>
            <Text
              size="xl"
              inline
            >
              1400x420 recommended
            </Text>
          </div>
        </Group>
      </Dropzone>
    </Box>
  )
}
