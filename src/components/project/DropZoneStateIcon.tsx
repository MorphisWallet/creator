import { Dropzone } from '@mantine/dropzone'
import { Center } from '@mantine/core'
import { IconUpload, IconX } from '@tabler/icons-react'

export const DropZoneStateIcon = () => {
  return (
    <>
      <Dropzone.Accept>
        <Center>
          <IconUpload
            size="2rem"
            stroke={1.5}
            color={'#868e96'}
          />
        </Center>
      </Dropzone.Accept>
      <Dropzone.Reject>
        <Center>
          <IconX
            size="2rem"
            stroke={1.5}
            color={'#868e96'}
          />
        </Center>
      </Dropzone.Reject>
      <Dropzone.Idle>
        <Center>
          <IconUpload
            size="2rem"
            stroke={1.5}
            color={'#868e96'}
          />
        </Center>
      </Dropzone.Idle>
    </>
  )
}
