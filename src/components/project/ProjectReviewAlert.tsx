import { Modal, Text, Image, Group, Center, Button } from '@mantine/core'
import { useRouter } from 'next/router'
import { useMediaQuery } from '@mantine/hooks'

type ProjectReviewAlertProps = {
  opened: boolean
  onClose: () => void
  logo: string
  name: string
  banner: string
  id: string
}

const LoadingIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_3016_11688)">
      <path
        d="M8.5 1.33521V4.00187"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12.002V14.6686"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.78662 3.28857L5.67329 5.17524"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3267 10.8286L13.2133 12.7153"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.83325 8.00195H4.49992"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 8.00195H15.1667"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.78662 12.7153L5.67329 10.8286"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3267 5.17524L13.2133 3.28857"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_3016_11688">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(0.5 0.00195312)"
        />
      </clipPath>
    </defs>
  </svg>
)

export const ProjectReviewAlert = ({ opened, onClose, logo, name, banner, id }: ProjectReviewAlertProps) => {
  const { push } = useRouter()
  const goToDetails = () => {
    void push(`/project/${id}`)
  }
  const largeScreen = useMediaQuery('(min-width: 64em)')

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      overlayProps={{
        blur: 7,
      }}
      size={800}
      styles={{
        body: {
          backgroundColor: '#D6D6D6',
          borderRadius: 32,
          padding: 40,
        },
      }}
    >
      <Image
        src={banner}
        width={'100%'}
        height={315}
        fit={'cover'}
        alt={'banner'}
        radius={8}
      />
      <Image
        src={logo}
        width={168}
        height={168}
        fit={'cover'}
        alt={'logo'}
        radius={56}
        styles={{
          image: {
            border: '9px solid #D6D6D6',
          },
        }}
        sx={{
          position: 'relative',
          top: -84,
        }}
        mx={'auto'}
        mb={-84}
      />
      <Center>
        <Group
          spacing={8}
          sx={{
            backgroundColor: '#B3B3B3',
            borderRadius: 80,
            display: 'inline-flex',
          }}
          px={24}
          py={8}
          mt={10}
        >
          <LoadingIcon />
          <Text
            color={'dark.8'}
            size={14}
          >
            In review
          </Text>
        </Group>
      </Center>
      <Center mt={20}>
        <Text
          size={largeScreen ? 36 : 20}
          fw={500}
          color={'dark.8'}
          align={'center'}
        >
          {name} has been submitted for review
        </Text>
      </Center>
      <Center mt={16}>
        <Text
          color={'#737375'}
          size={largeScreen ? 20 : 14}
          fw={500}
        >
          Please wait while we review for project
        </Text>
      </Center>
      <Center mt={40}>
        <Button
          color={'dark.8'}
          sx={{
            height: 40,
          }}
          radius={12}
          px={38}
          onClick={() => void goToDetails()}
        >
          <Text
            size={16}
            fw={500}
          >
            See Preview
          </Text>
        </Button>
      </Center>
    </Modal>
  )
}
