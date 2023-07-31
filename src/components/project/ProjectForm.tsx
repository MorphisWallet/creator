import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
  Text,
  Box,
  Checkbox,
  Radio,
  Modal,
  Image,
  SimpleGrid,
  Center,
} from '@mantine/core'
import { BannerImage } from '@/components/project/BannerImage'
import { useForm } from '@mantine/form'
import { api } from '@/utils/api'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { projectCreateOrUpdateSchema, type ProjectCreateOrUpdateSchemaType } from '@/schemas'
import { modals } from '@mantine/modals'
import { ProjectBlockchain, type Project, ProjectStage, ProjectStatus, Category } from '@prisma/client'
import { LogoUpload } from '@/components/project/LogoUpload'
import { PreviewImage } from '@/components/project/PreviewImage'
import { pascalToNormal } from '@/utils/string'
import { ProjectPreview } from '@/components/project/ProjectPreview'
import { useSession } from 'next-auth/react'
import { useDisclosure } from '@mantine/hooks'
import { ProjectStatusBadge } from '@/components/project/ProjectStatusBadge'

type Props = {
  project?: Project
}

type FormValues = {
  blockchain: ProjectBlockchain
  name: string
  logoUrl: string
  description: string
  website: string
  twitter: string
  discord: string
  bannerImage: string
  previewImages: string[]
  projectStage: ProjectStage
  categories: Category[]
}

export const ProjectForm = ({ project }: Props) => {
  const { data } = useSession()
  const [isOpened, handler] = useDisclosure(false)
  const isAdmin = data?.user?.role === 'Admin'
  const isPublished = project?.status === 'Published'
  const projectBlockchain = Object.values(ProjectBlockchain)
  const categories = Object.values(Category)
  const form = useForm<FormValues>({
    initialValues: {
      name: project?.name ?? '',
      description: project?.description ?? '',
      blockchain: project?.blockchain ?? 'Ethereum',
      bannerImage: project?.bannerImage ?? '',
      logoUrl: project?.logoUrl ?? '',
      projectStage: project?.projectStage ?? 'Mainnet',
      previewImages: project?.previewImages ?? [],
      twitter: project?.twitter ?? '',
      website: project?.website ?? '',
      discord: project?.discord ?? '',
      categories: project?.categories ?? [],
    },
    validate: {
      name: value => {
        if (!value) {
          return 'Name is required'
        }
        if (value.length > 50) {
          return 'Name must not exceed 50 characters'
        }
        return null
      },
      description: value => {
        if (!value) {
          return 'Description is required'
        }
        if (value.length > 500) {
          return 'Description must not exceed 500 characters'
        }
      },
      blockchain: value => (!projectBlockchain.includes(value) ? 'Please select a blockchain' : null),
      categories: value => (!value.length ? 'Please select at least one category' : null),
    },
  })

  const blockchainSelectData = projectBlockchain.map(blockchain => ({
    value: blockchain,
    label: blockchain,
  }))

  const categoriesSelectData = categories.map(category => ({
    value: category,
    label: category,
  }))

  const projectStageSelectData = Object.values(ProjectStage).map(stage => ({
    value: stage,
    label: pascalToNormal(stage),
  }))

  const {
    mutate,
    isLoading,
    data: projectData,
  } = api.project.createOrUpdate.useMutation({
    onError: error => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Project saved successfully',
        color: 'green',
      })
      if (isAdmin) {
        void goBack()
      } else {
        handler.open()
      }
    },
  })

  const { push } = useRouter()

  const goToProject = () => {
    void push('/dashboard/project')
  }

  const goToDetails = (id: string) => {
    void push(`/dashboard/project/${id}`)
  }

  const goBack = () => {
    if (isPublished) {
      goToDetails(project?.id)
    } else {
      goToProject()
    }
  }

  const createOrUpdateProject = (data: Partial<ProjectCreateOrUpdateSchemaType>) => {
    if (data?.bannerImage === '') {
      return notifications.show({
        title: 'Error',
        color: 'red',
        message: 'Banner image is required',
      })
    }

    if (data?.previewImages?.length === 0) {
      return notifications.show({
        title: 'Error',
        color: 'red',
        message: 'Preview images are required',
      })
    }

    if (data?.logoUrl === '') {
      return notifications.show({
        title: 'Error',
        color: 'red',
        message: 'Logo is required',
      })
    }

    const resultToParse = {
      ...data,
    }

    if (project?.id) {
      resultToParse.id = project.id
    }
    const zodResult = projectCreateOrUpdateSchema.parse(resultToParse)

    mutate(zodResult)
  }

  const openModal = () =>
    modals.openConfirmModal({
      title: 'Save your changes?',
      labels: { confirm: 'Save as draft', cancel: 'Discard changes' },
      onCancel: () => void goBack(),
      onConfirm: () => {
        const { hasErrors } = form.validate()
        if (!hasErrors) {
          createOrUpdateProject({
            ...form.values,
            status: ProjectStatus.Draft,
          })
        }
      },
    })

  return (
    <Group align="flex-start">
      <Box sx={{ flex: 1 }}>
        <form
          onSubmit={form.onSubmit(values => {
            const status = isAdmin ? ProjectStatus.Published : ProjectStatus.InReview
            createOrUpdateProject({
              ...values,
              status,
            })
          })}
        >
          <Stack>
            <Card
              padding="lg"
              radius="md"
              withBorder
            >
              <Text
                size={'xl'}
                mb={'md'}
              >
                About the project 🔥
              </Text>
              <Stack>
                <Select
                  label="Blockchain"
                  required
                  data={blockchainSelectData}
                  {...form.getInputProps('blockchain')}
                  disabled={isPublished}
                />
                <TextInput
                  label="Name of the Project"
                  placeholder="Name of the project"
                  required
                  {...form.getInputProps('name')}
                  disabled={isPublished}
                />
                <Checkbox.Group
                  label="Categories"
                  {...form.getInputProps('categories')}
                  required
                >
                  <Group>
                    {categoriesSelectData.map(category => (
                      <Checkbox
                        key={category.value}
                        value={category.value}
                        label={category.label}
                        disabled={isPublished}
                      />
                    ))}
                  </Group>
                </Checkbox.Group>
                <Radio.Group
                  label="Project Stage"
                  required
                  {...form.getInputProps('projectStage')}
                >
                  <Group>
                    {projectStageSelectData.map(stage => (
                      <Radio
                        key={stage.value}
                        value={stage.value}
                        label={stage.label}
                      />
                    ))}
                  </Group>
                </Radio.Group>
                <Textarea
                  label="Description"
                  placeholder="The description of the project"
                  required
                  {...form.getInputProps('description')}
                  minRows={8}
                />
              </Stack>
            </Card>
            <Card
              padding="lg"
              radius="md"
              withBorder
            >
              <Text
                size={'xl'}
                mb={'md'}
              >
                Links 🍀
              </Text>
              <Stack>
                <TextInput
                  label="Twitter"
                  placeholder="Project twitter url"
                  {...form.getInputProps('twitter')}
                  disabled={isPublished}
                />
                <TextInput
                  label="Discord"
                  placeholder="Project discord url"
                  {...form.getInputProps('discord')}
                  disabled={isPublished}
                />
                <TextInput
                  label="Website"
                  placeholder="Project website url"
                  {...form.getInputProps('website')}
                  disabled={isPublished}
                />
              </Stack>
            </Card>
            <Card
              padding="lg"
              radius="md"
              withBorder
            >
              <Text
                size={'xl'}
                mb={'md'}
              >
                Profile 💌
              </Text>
              <Stack>
                <LogoUpload
                  initialImageUrl={form.values.logoUrl}
                  onImageUrlChange={url => form.setFieldValue('logoUrl', url)}
                  disabled={isPublished}
                />
                <BannerImage
                  initialImageUrl={form.values.bannerImage}
                  onImageUrlChange={url => form.setFieldValue('bannerImage', url)}
                />
                <PreviewImage
                  initialImageUrls={form.values.previewImages}
                  onImageUrlChange={url => form.setFieldValue('previewImages', url)}
                />
              </Stack>
            </Card>
            <Group>
              <Button
                onClick={() => {
                  if (isPublished) {
                    goBack()
                  } else {
                    openModal()
                  }
                }}
                variant={'outline'}
                size={'md'}
                miw={200}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                size={'md'}
                miw={200}
              >
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Box>
      <Box w={600}>
        <ProjectPreview
          bannerImage={form.values.bannerImage}
          previewImages={form.values.previewImages}
          name={form.values.name}
          logoUrl={form.values.logoUrl}
        />
      </Box>
      <Modal
        opened={isOpened}
        onClose={handler.close}
        size={'xl'}
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        <Image
          src={form.values.bannerImage}
          height={280}
          fit={'cover'}
          alt={'Project banner image'}
          withPlaceholder
          mt={'md'}
        />
        <Image
          src={form.values.logoUrl}
          height={94}
          width={94}
          alt={'logo'}
          radius={'50%'}
          withPlaceholder
          mx={'auto'}
          sx={{ position: 'relative', top: -42 }}
        />
        <Center>
          <ProjectStatusBadge status={'InReview'} />
        </Center>
        <Text
          size={'xl'}
          fw={'bold'}
          mt={'xl'}
          align={'center'}
        >
          {form.values.name} has been submitted for review
        </Text>
        <Text
          color={'dimmed'}
          mb={'xl'}
          align={'center'}
        >
          It will be published after we review it
        </Text>
        <SimpleGrid
          cols={2}
          spacing="lg"
        >
          <Button
            color={'dark'}
            radius={'xl'}
            w={'100%'}
            onClick={goToProject}
          >
            My products
          </Button>
          <Button
            variant={'outline'}
            color={'dark'}
            radius={'xl'}
            w={'100%'}
            onClick={() => goToDetails(projectData?.project?.id ?? '')}
          >
            See preview
          </Button>
        </SimpleGrid>
      </Modal>
    </Group>
  )
}
