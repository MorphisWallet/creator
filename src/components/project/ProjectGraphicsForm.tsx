import { FormLayout } from '@/components/form/FormLayout'
import { Stack } from '@mantine/core'
import { FormTitle } from '@/components/form/FormTitle'
import { LogoUpload } from '@/components/project/LogoUpload'
import { BannerImage } from '@/components/project/BannerImage'
import { PreviewImage } from '@/components/project/PreviewImage'
import { useProjectFormStore } from '@/store'

type Props = {
  isDisabled: boolean
}

export const ProjectGraphicsForm = ({ isDisabled }: Props) => {
  const { logoUrl, previewImages, bannerImage, updateField } = useProjectFormStore()

  return (
    <FormLayout>
      <Stack spacing={24}>
        <Stack spacing={8}>
          <FormTitle
            label={'Logo'}
            required={true}
          />
          <LogoUpload
            initialImageUrl={logoUrl}
            onImageUrlChange={url => updateField('logoUrl', url)}
            disabled={isDisabled}
          />
        </Stack>
        <Stack spacing={8}>
          <FormTitle
            label={'Banner image'}
            required={true}
          />
          <BannerImage
            initialImageUrl={bannerImage}
            onImageUrlChange={url => updateField('bannerImage', url)}
          />
        </Stack>
        <Stack spacing={8}>
          <FormTitle label={'Preview image'} />
          <PreviewImage
            initialImageUrls={previewImages}
            onImageUrlChange={urls => updateField('previewImages', urls)}
          />
        </Stack>
      </Stack>
    </FormLayout>
  )
}
