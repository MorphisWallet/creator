import { type Project, ProjectStatus } from '@prisma/client'
import { Box, Button, Group, Text } from '@mantine/core'
import { ProjectReviewAlert } from '@/components/project/ProjectReviewAlert'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ProjectDetailForm } from '@/components/project/ProjectDetailForm'
import { ProjectLinksForm } from '@/components/project/ProjectLinksForm'
import { ProjectGraphicsForm } from '@/components/project/ProjectGraphicsForm'
import { useSession } from 'next-auth/react'
import { api } from '@/utils/api'
import { notifications } from '@mantine/notifications'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { projectCreateOrUpdateSchema, type ProjectCreateOrUpdateSchemaType } from '@/schemas'
import { useProjectFormStore } from '@/store'
import { modals } from '@mantine/modals'

type TabProps = {
  label: string
  active: boolean
  onClick: () => void
}

const Tab = ({ label, onClick, active }: TabProps) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        backgroundColor: active ? '#2F2F2F' : 'transparent',
        borderRadius: 12,
      }}
      py={11}
      px={16}
    >
      <Text
        size={16}
        color={'white.1'}
        fw={700}
      >
        {label}
      </Text>
    </Box>
  )
}

type Props = {
  project?: Project
}

export const ProjectForm = ({ project }: Props) => {
  const { data } = useSession()
  const [isOpened, handler] = useDisclosure(false)
  const { push } = useRouter()
  const isAdmin = data?.user?.role === 'Admin'
  const isPublishedOrInReview = project?.status === 'Published' || project?.status === 'InReview'
  const shouldDisableEdit = isPublishedOrInReview && !isAdmin

  const goToProject = () => {
    void push('/')
  }

  const goToDetails = (id: string) => {
    void push(`/project/${id}`)
  }

  const goBack = () => {
    if (isPublishedOrInReview) {
      goToDetails(project?.id)
    } else {
      goToProject()
    }
  }

  const [activeTab, setActiveTab] = useState('Details')

  const getTitle = () => {
    switch (activeTab) {
      case 'Details':
        return 'Project details'
      case 'Links':
        return 'Project links'
      case 'Graphics':
        return 'Project graphics'
    }
  }

  const getForm = () => {
    switch (activeTab) {
      case 'Details':
        return <ProjectDetailForm isDisabled={shouldDisableEdit} />
      case 'Links':
        return <ProjectLinksForm isDisabled={shouldDisableEdit} />
      case 'Graphics':
        return <ProjectGraphicsForm isDisabled={shouldDisableEdit} />
    }
  }

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
    onSuccess: data => {
      notifications.show({
        title: 'Success',
        message: 'Project saved successfully',
        color: 'green',
      })
      if (isAdmin) {
        void goToDetails(data.project.id)
      } else {
        if (data.project.status === 'InReview') {
          handler.open()
        } else {
          void goToDetails(data.project.id)
        }
      }
    },
  })

  const {
    projectStage,
    logoUrl,
    bannerImage,
    previewImages,
    discord,
    twitter,
    website,
    description,
    categories,
    blockchains,
    name,
    slug,
    reset,
    updateField,
  } = useProjectFormStore()

  useEffect(() => {
    reset()
    if (project) {
      updateField('projectStage', project.projectStage)
      updateField('logoUrl', project.logoUrl)
      updateField('bannerImage', project.bannerImage)
      updateField('previewImages', project.previewImages)
      updateField('discord', project.discord ?? '')
      updateField('twitter', project.twitter ?? '')
      updateField('website', project.website ?? '')
      updateField('description', project.description)
      updateField('categories', project.categories)
      updateField('blockchains', project.blockchains)
      updateField('name', project.name)
      updateField('slug', project.slug)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createOrUpdateProject = (status: ProjectStatus) => {
    const resultToParse: Partial<ProjectCreateOrUpdateSchemaType> = {
      projectStage,
      logoUrl,
      bannerImage,
      previewImages,
      discord,
      twitter,
      website,
      description,
      categories,
      blockchains,
      name,
      status,
      slug,
    }

    if (project?.id) {
      resultToParse.id = project.id
    }

    const zodResult = projectCreateOrUpdateSchema.safeParse(resultToParse)

    if (!zodResult.success) {
      return notifications.show({
        title: 'Error',
        color: 'red',
        message: zodResult.error.issues[0]?.message,
      })
    }

    mutate(zodResult.data)
  }

  const submitProject = () => {
    let status = isAdmin ? ProjectStatus.Published : ProjectStatus.InReview
    if (project?.status === 'Published') {
      status = ProjectStatus.Published
    }
    createOrUpdateProject(status)
  }

  const openModal = () =>
    modals.openConfirmModal({
      title: 'Save your changes?',
      labels: { confirm: 'Save as draft', cancel: 'Discard changes' },
      onCancel: () => void goBack(),
      onConfirm: () => {
        createOrUpdateProject(ProjectStatus.Draft)
      },
    })
  const largeScreen = useMediaQuery('(min-width: 64em)')

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: largeScreen ? '300px 1fr' : '1fr',
        }}
      >
        <Box
          sx={{
            borderRight: largeScreen ? '1px solid #2F2F2F' : 'none',
            alignSelf: 'stretch',
            minHeight: largeScreen ? 'calc(100vh - 94px)' : 'auto',
          }}
          pr={{
            xs: 0,
            md: 16,
          }}
        >
          <Group
            spacing={0}
            pt={40}
            mb={27}
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => {
              if (isPublishedOrInReview) {
                goBack()
              } else {
                openModal()
              }
            }}
          >
            <svg
              width="19"
              height="12"
              viewBox="0 0 19 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 1V5H3.83L7.41 1.41L6 0L0 6L6 12L7.41 10.58L3.83 7H19V1H17Z"
                fill="#E6E6E6"
              />
            </svg>
            <Text
              color={'white.1'}
              ml={'md'}
              fw={700}
              size={'md'}
            >
              My collections
            </Text>
          </Group>
          <Tab
            label={'Details'}
            onClick={() => setActiveTab('Details')}
            active={activeTab === 'Details'}
          />
          <Tab
            label={'Links'}
            onClick={() => setActiveTab('Links')}
            active={activeTab === 'Links'}
          />
          <Tab
            label={'Graphics'}
            onClick={() => setActiveTab('Graphics')}
            active={activeTab === 'Graphics'}
          />
        </Box>
        <Box
          pt={{
            xs: 20,
            md: 40,
          }}
          sx={{ flex: 1 }}
        >
          <Text
            color={'white.1'}
            size={32}
            fw={700}
            ml={64}
          >
            {getTitle()}
          </Text>
          <Box
            ml={{
              xs: 0,
              md: 16,
            }}
            mt={{
              xs: 17,
              md: 34,
            }}
          >
            {getForm()}
            <Group
              mt={34}
              position={'right'}
              pb={32}
            >
              <Button
                loading={isLoading}
                sx={{
                  backgroundColor: '#ED3733',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 16,
                  padding: '9px 20px',
                  height: 40,
                }}
                color={'red'}
                onClick={submitProject}
              >
                Submit for Review
              </Button>
            </Group>
          </Box>
        </Box>
      </Box>
      <ProjectReviewAlert
        opened={isOpened}
        onClose={handler.close}
        logo={logoUrl}
        banner={bannerImage}
        id={projectData?.project.id ?? ''}
        name={name}
      />
    </>
  )
}
