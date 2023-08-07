import { useRouter } from 'next/router'
import Head from 'next/head'
import { ActionIcon, Box, Container, Group, Image, Text } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { type GetServerSideProps } from 'next'
import { type Prisma } from '@prisma/client'
import { prisma } from '@/server/db'
import { ProjectStatusBadge } from '@/components/project/ProjectStatusBadge'
import { ProjectDropdownMenu } from '@/components/project/ProjectDropdownMenu'
import { Carousel } from '@mantine/carousel'
import { RejectMessage } from '@/components/project/RejectMessage'
import { Layout } from '@/components/layout/Layout'
import { type ReactNode } from 'react'
import { Tag } from '@/components/common/Tag'
import dayjs from 'dayjs'
import { pascalToNormal } from '@/utils/string'
import { getServerAuthSession } from '@/server/auth'

async function getProjectWithUser(filter: Prisma.ProjectWhereUniqueInput) {
  return await prisma.project.findUnique({
    where: filter,
    include: {
      user: true,
    },
  })
}

type ProjectWithUser = Exclude<Prisma.PromiseReturnType<typeof getProjectWithUser>, null>

type Props = {
  project: ProjectWithUser
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const id = context.params?.id
  if (!id || typeof id !== 'string') {
    return {
      notFound: true,
    }
  }
  const session = await getServerAuthSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const filter: Prisma.ProjectWhereUniqueInput = {
    id,
  }
  if (session.user.role !== 'Admin') {
    filter['userId'] = session.user.id
  }
  const project = await getProjectWithUser(filter)
  if (!project) {
    return {
      notFound: true,
    }
  }

  return {
    props: { project },
  }
}

const LabelText = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      color={'#999999'}
      size={16}
    >
      {children}
    </Text>
  )
}

const ValueText = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      color={'#FFFFFF'}
      size={16}
      fw={700}
    >
      {children}
    </Text>
  )
}

const WebsiteLink = ({ link }: { link?: string | null }) => {
  if (!link) return null
  return (
    <a href={link}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.00398 0.000324985C10.5843 0.000324985 12.1368 0.416795 13.5052 1.20792C14.8734 1.99891 16.0093 3.1366 16.7983 4.50638C17.5875 5.8762 18.0019 7.42984 18 9.01083C17.9784 13.9987 13.9319 18.0323 8.98798 17.9998C6.60207 17.9977 4.31491 17.0475 2.62913 15.3581C0.943646 13.6687 -0.00211692 11.3788 3.55801e-06 8.99161C0.00226257 6.60477 0.952064 4.31648 2.64067 2.63029C4.32917 0.943932 6.61816 -0.00211785 9.00402 3.56006e-06L9.00398 0.000324985ZM11.1036 7.22017H6.91153C6.71223 8.39977 6.71223 9.60451 6.91153 10.7841H11.102C11.2948 9.60402 11.2954 8.40045 11.1038 7.22017H11.1036ZM5.07089 7.22017H5.07102C5.03349 7.21151 4.99571 7.20498 4.95756 7.20034H2.19767C2.14722 7.19582 2.09715 7.21277 2.05987 7.24692C2.02247 7.28119 2.00139 7.32966 2.00151 7.38038C1.75214 8.43932 1.74724 9.54123 1.98721 10.6023C1.98909 10.6659 2.01971 10.7253 2.07029 10.7637C2.12099 10.8021 2.18625 10.8155 2.24799 10.8003H4.86042C4.92693 10.8003 4.99533 10.8003 5.07628 10.7878H5.07641C4.9174 9.60405 4.91564 8.40449 5.07101 7.2203L5.07089 7.22017ZM12.9314 7.22017C13.0937 8.40141 13.0937 9.59923 12.9314 10.7806C12.9707 10.7891 13.0104 10.7952 13.0503 10.7987H15.8084C15.8589 10.8032 15.9088 10.7862 15.9462 10.752C15.9835 10.7177 16.0047 10.6694 16.0045 10.6186C16.2541 9.55305 16.2541 8.44426 16.0045 7.37867C15.9997 7.32066 15.9699 7.26755 15.923 7.23303C15.8762 7.1985 15.8166 7.18607 15.7599 7.19875H13.1276C13.07 7.20051 13.0089 7.21306 12.9314 7.21846V7.22017ZM7.29996 5.37876H10.7184C10.3394 4.1163 9.76048 2.92275 9.00382 1.84373C8.2517 2.92401 7.67653 4.11743 7.30002 5.37876H7.29996ZM7.29996 12.6128C7.67821 13.877 8.25327 15.0736 9.00376 16.1587C9.75364 15.0739 10.3285 13.8779 10.7076 12.6147H7.2891L7.29996 12.6128ZM15.2055 5.4003C14.5452 4.07554 12.3807 2.31147 11.3713 2.25936C11.8715 3.21724 12.2672 4.2262 12.5516 5.26884C12.5906 5.33965 12.6619 5.38673 12.7422 5.3949C13.282 5.40569 13.8218 5.3949 14.3614 5.3949H15.2053L15.2055 5.4003ZM6.61627 2.2162C5.01563 2.78461 3.66598 3.89841 2.80391 5.36253C2.82274 5.37559 2.84332 5.38588 2.86516 5.39317H5.30665C5.37819 5.37157 5.43554 5.31758 5.46127 5.24727C5.61238 4.80267 5.72935 4.34728 5.89851 3.91171C6.11086 3.35549 6.3591 2.81559 6.61638 2.2162L6.61627 2.2162ZM2.80745 12.6002C3.35613 13.8349 5.63224 15.7015 6.62173 15.7357C6.58759 15.6673 6.55521 15.6061 6.52998 15.5431C6.21334 14.7601 5.89847 13.9609 5.58547 13.1672C5.51708 12.9871 5.52072 12.737 5.4055 12.6487C5.2903 12.5606 5.02588 12.6002 4.83159 12.6002H2.80751L2.80745 12.6002ZM11.3571 15.7933C12.9765 15.2233 14.3431 14.1003 15.2164 12.6218C15.1736 12.6135 15.1303 12.6074 15.0869 12.6038H12.7282C12.6804 12.6003 12.6332 12.616 12.5971 12.6475C12.561 12.6789 12.5388 12.7233 12.5357 12.7712C12.2694 13.5308 11.9959 14.2885 11.7171 15.041C11.6253 15.2839 11.4922 15.5144 11.3571 15.7933Z"
          fill="#E6E6E6"
        />
      </svg>
    </a>
  )
}

const TwitterLink = ({ link }: { link?: string | null }) => {
  if (!link) return null
  return (
    <a href={link}>
      <svg
        width="19"
        height="16"
        viewBox="0 0 19 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 1.89694C18.2859 2.21406 17.5308 2.4237 16.758 2.51933C17.5733 2.02076 18.1842 1.23641 18.4775 0.311781C17.7114 0.778637 16.8727 1.10757 15.998 1.28427C15.4133 0.635204 14.6347 0.20315 13.7843 0.0558712C12.9339 -0.0914075 12.0598 0.0544193 11.2991 0.470481C10.5384 0.886542 9.93409 1.5493 9.58098 2.35482C9.22787 3.16034 9.14593 4.06306 9.348 4.92138C7.79896 4.84118 6.28372 4.42829 4.90072 3.70953C3.51772 2.99077 2.2979 1.98222 1.3205 0.749401C0.977681 1.36223 0.797543 2.05626 0.798 2.76246C0.796784 3.41829 0.954006 4.06425 1.25567 4.64283C1.55733 5.22141 1.99407 5.71466 2.527 6.07865C1.90758 6.0614 1.30139 5.89125 0.76 5.58268V5.6313C0.764643 6.5502 1.07919 7.43925 1.65045 8.14807C2.2217 8.8569 3.01459 9.34198 3.895 9.52126C3.55609 9.62684 3.20423 9.68251 2.85 9.68659C2.6048 9.68366 2.3602 9.66089 2.1185 9.61851C2.36921 10.409 2.85439 11.0998 3.50652 11.5948C4.15865 12.0898 4.9453 12.3644 5.757 12.3804C4.38634 13.4844 2.69409 14.087 0.95 14.092C0.632448 14.093 0.315149 14.0735 0 14.0336C1.78071 15.2106 3.85587 15.8354 5.9755 15.8327C7.43821 15.8483 8.88928 15.5653 10.244 15.0004C11.5986 14.4354 12.8298 13.5998 13.8654 12.5423C14.9011 11.4848 15.7206 10.2267 16.2759 8.8414C16.8313 7.4561 17.1114 5.97141 17.1 4.47404C17.1 4.30872 17.1 4.13367 17.1 3.95862C17.8455 3.38953 18.4884 2.69188 19 1.89694Z"
          fill="#E6E6E6"
        />
      </svg>
    </a>
  )
}

const DiscordLink = ({ link }: { link?: string | null }) => {
  if (!link) return null
  return (
    <a href={link}>
      <svg
        width="19"
        height="14"
        viewBox="0 0 19 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.1917 0C12.0033 0.320645 11.8355 0.651788 11.689 0.991629C10.2501 0.775319 8.78444 0.775319 7.34556 0.991629C7.19912 0.651788 7.03128 0.320645 6.84293 0C5.48753 0.220142 4.16989 0.614393 2.92621 1.17192C0.702261 4.2228 -0.30632 7.92668 0.081143 11.6201C1.53046 12.6558 3.1571 13.4457 4.88931 13.9549C5.28375 13.4597 5.63577 12.9351 5.94199 12.3863C5.37684 12.1883 4.83364 11.9377 4.3203 11.6381C4.46109 11.5491 4.59428 11.4496 4.71861 11.3406C6.21555 12.026 7.85574 12.382 9.5173 12.382C11.1788 12.382 12.819 12.026 14.316 11.3406C14.4488 11.4488 14.5815 11.548 14.7143 11.6381C14.1982 11.9353 13.6555 12.1887 13.0926 12.3954C13.3861 12.9566 13.7287 13.4933 14.1168 14C15.8469 13.4925 17.4707 12.7024 18.9155 11.6652C19.3123 7.97108 18.3029 4.26417 16.0704 1.217C14.8407 0.647928 13.5361 0.238595 12.1917 0ZM6.36875 9.51062C5.89418 9.47824 5.45126 9.27235 5.13297 8.93617C4.81468 8.6 4.64577 8.15969 4.66171 7.70766C4.64337 7.25504 4.81144 6.81347 5.13021 6.47679C5.44897 6.14011 5.8933 5.93488 6.36875 5.9047C6.8442 5.93488 7.28853 6.14011 7.60729 6.47679C7.92606 6.81347 8.09413 7.25504 8.07579 7.70766C8.09413 8.16028 7.92606 8.60186 7.60729 8.93853C7.28853 9.27521 6.8442 9.48045 6.36875 9.51062ZM12.6658 9.51062C12.1913 9.47824 11.7483 9.27235 11.4301 8.93617C11.1118 8.6 10.9429 8.15969 10.9588 7.70766C10.9405 7.25504 11.1085 6.81347 11.4273 6.47679C11.7461 6.14011 12.1904 5.93488 12.6658 5.9047C13.1422 5.93262 13.5879 6.13719 13.9072 6.47439C14.2264 6.81158 14.3937 7.25444 14.3729 7.70766C14.3937 8.16088 14.2264 8.60374 13.9072 8.94094C13.5879 9.27813 13.1422 9.4827 12.6658 9.51062Z"
          fill="#E6E6E6"
        />
      </svg>
    </a>
  )
}

export default function ProjectDetailPage({ project }: Props) {
  const { push, query } = useRouter()
  const goBack = () => {
    if (query?.from === 'admin') return push('/dashboard/admin')
    return push('/dashboard/project')
  }

  const projectName = project.name

  const title = `Kiosk - Project - ${projectName}`

  return (
    <Layout fullWidth={true}>
      <Head>
        <title>{title}</title>
      </Head>
      <Box sx={{ position: 'relative' }}>
        <ActionIcon
          variant="filled"
          radius="xl"
          onClick={() => void goBack()}
          sx={{
            position: 'absolute',
            top: 30,
            left: 30,
            zIndex: 1,
          }}
        >
          <IconArrowLeft
            size="1rem"
            color={'white'}
          />
        </ActionIcon>
        <Image
          src={project.bannerImage}
          height={600}
          fit={'cover'}
          alt={projectName}
        />
      </Box>

      <Container size={'lg'}>
        <Box sx={{ position: 'relative', marginBottom: -84 }}>
          <Image
            src={project.logoUrl}
            width={168}
            height={168}
            fit={'cover'}
            alt={'logo'}
            radius={56}
            styles={{
              image: {
                border: '9px solid #1D1D1F',
              },
            }}
            sx={{
              position: 'relative',
              top: -84,
            }}
          />
        </Box>

        {project.status === 'Rejected' && (
          <Box mt={40}>
            <RejectMessage message={project.rejectedReason} />
          </Box>
        )}

        <Group
          position={'apart'}
          mt={45}
        >
          <Group spacing={18}>
            <Text
              lineClamp={1}
              truncate
              color={'white.1'}
              size={34}
              fw={800}
            >
              {project.name}
            </Text>
            <Box
              sx={{
                backgroundColor: '#C8FD7C',
                borderRadius: '8px',
              }}
              px={8}
              py={2}
            >
              <Text
                size={15}
                fw={500}
                color={'#222222'}
              >
                {pascalToNormal(project.projectStage)}
              </Text>
            </Box>
          </Group>
          <Group>
            <ProjectStatusBadge status={project.status} />
            <ProjectDropdownMenu
              id={project.id}
              onDeleted={() => void goBack()}
            />
          </Group>
        </Group>
        <Group
          spacing={26}
          mt={14}
          mb={11}
        >
          <Group spacing={5}>
            <LabelText>By</LabelText>
            <ValueText>{project.user.name}</ValueText>
          </Group>
          <Group spacing={5}>
            <LabelText>Created</LabelText>
            <ValueText>{dayjs(project.createdAt).format('MMM YYYY')}</ValueText>
          </Group>
        </Group>
        <Group spacing={26}>
          <Group spacing={8}>
            <LabelText>Built on:</LabelText>
            <Tag label={project.blockchain} />
          </Group>
          <Group spacing={8}>
            <LabelText>Categories:</LabelText>
            <Group spacing={12}>
              {project.categories.map((category, index) => (
                <Tag
                  key={index}
                  label={category}
                />
              ))}
            </Group>
          </Group>
        </Group>
        <Group
          mt={23}
          spacing={33}
        >
          <WebsiteLink link={project.website} />
          <TwitterLink link={project.twitter} />
          <DiscordLink link={project.discord} />
        </Group>
        {project.previewImages.length > 1 && (
          <Carousel
            mx="auto"
            mt={64}
            withIndicators={false}
            height={480}
            mb={93}
            slideGap="md"
            slideSize="640px"
            align="start"
            dragFree
            withControls={false}
            containScroll={'trimSnaps'}
            sx={{
              cursor: 'grab',
            }}
          >
            {project.previewImages.map((image, index) => (
              <Carousel.Slide key={index}>
                <Image
                  src={image}
                  height={480}
                  fit={'cover'}
                  alt={projectName}
                  radius={16}
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        )}
        <Box
          sx={{
            borderBottom: '1px solid #303134',
          }}
          mb={40}
        >
          <Text
            size={16}
            fw={700}
            color={'white.1'}
            sx={{
              borderBottom: '3px solid #E6E6E6',
              display: 'inline-block',
            }}
          >
            Project Details
          </Text>
        </Box>
        <Text
          size={24}
          fw={700}
          color={'white.1'}
          mb={14}
        >
          About Project
        </Text>
        <Text
          size={16}
          color={'white.1'}
          pb={40}
          sx={{
            whiteSpace: 'pre-line',
          }}
        >
          {project.description}
        </Text>
      </Container>
    </Layout>
  )
}
