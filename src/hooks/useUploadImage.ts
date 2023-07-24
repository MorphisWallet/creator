import { useState } from 'react'
import { api } from '@/utils/api'
import { notifications } from '@mantine/notifications'
import { type FileWithPath } from '@mantine/dropzone'

export const useUploadImage = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState<FileWithPath | null>(null)

  const { mutate, isLoading } = api.upload.getUploadUrl.useMutation({
    onSuccess: async ({ uploadUrl, imageUrl }) => {
      try {
        if (!file) return
        setIsUploading(true)
        const upload = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })

        if (upload.ok) {
          setImageUrl(imageUrl)
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
        setIsUploading(false)
      }
    },
  })

  const loading = isLoading || isUploading

  const upload = (file: FileWithPath) => {
    setFile(file)
    const extension = file.name.split('.').pop()
    if (!extension) return
    mutate({ extension: extension })
  }

  return {
    loading,
    imageUrl,
    upload,
  }
}
