import { Box, Button, Chip, Group, Stack, Switch, Text, TextInput } from '@mantine/core'
import { create } from 'zustand'
import { TwitterRequirementType } from '@prisma/client'
import { useSession } from 'next-auth/react'

type Props = {
  disabled: boolean
}

type TwitterRequirement = {
  type: TwitterRequirementType | ''
  value: string
  error?: string
}

type TwitterRequirementStore = {
  enableTwitterRequirement: boolean
  setEnableTwitterRequirement: (enableTwitterRequirement: boolean) => void
  twitterRequirement: TwitterRequirement[]
  setTwitterRequirement: (twitterRequirement: TwitterRequirement[]) => void
  resetTwitterRequirement: () => void
}

export const useTwitterRequirementStore = create<TwitterRequirementStore>(set => ({
  enableTwitterRequirement: false,
  setEnableTwitterRequirement: enableTwitterRequirement => set({ enableTwitterRequirement: enableTwitterRequirement }),
  twitterRequirement: [
    {
      value: '',
      type: '',
    },
  ],
  setTwitterRequirement: twitterRequirement => set({ twitterRequirement }),
  resetTwitterRequirement: () => set({ enableTwitterRequirement: false, twitterRequirement: [{ value: '', type: '' }] }),
}))

const isTweetValid = (link: string) => {
  const tweetLinkRegex = /^https?:\/\/(?:www\.)?twitter\.com\/\w+\/status\/\d+$/i
  return tweetLinkRegex.test(link)
}
const isTweetSpaceValid = (link: string) => {
  return link.startsWith('https://twitter.com/i/spaces/')
}

export const TwitterRequirement = ({ disabled }: Props) => {
  const { enableTwitterRequirement, setEnableTwitterRequirement, twitterRequirement, setTwitterRequirement } = useTwitterRequirementStore()

  const options = Object.values(TwitterRequirementType).map(type => ({ value: type, label: type }))

  const addNewTokenRequirement = () => {
    const typeSelected = twitterRequirement.every(requirement => requirement.type !== '')
    if (!typeSelected) return
    setTwitterRequirement([...twitterRequirement, { type: '', value: '' }])
  }

  const { data: sessionData } = useSession()

  return (
    <Box>
      <Group>
        <h2>Twitter requirements</h2>
        <Switch
          disabled={disabled}
          checked={enableTwitterRequirement}
          onChange={() => setEnableTwitterRequirement(!enableTwitterRequirement)}
        />
      </Group>
      <Stack>
        {enableTwitterRequirement &&
          twitterRequirement.map((requirement, index) => {
            return (
              <Box key={index}>
                <Text>Must</Text>
                <Chip.Group
                  value={requirement.type}
                  multiple={false}
                  onChange={type => {
                    const twitterUserName = sessionData?.user?.twitter?.username ?? ''
                    const disableInput = type === 'Follow'
                    const inputValue = disableInput ? `@${twitterUserName}` : ''
                    const data = twitterRequirement.map((requirement, i) => {
                      if (i === index) {
                        return { value: inputValue, type: type as TwitterRequirementType }
                      }
                      return requirement
                    })
                    setTwitterRequirement(data)
                  }}
                >
                  <Group my={'xs'}>
                    {options.map(option => (
                      <Chip
                        value={option.value}
                        key={option.value}
                        disabled={disabled}
                      >
                        {option.label}
                      </Chip>
                    ))}
                  </Group>
                </Chip.Group>
                {requirement.type && (
                  <TextInput
                    maw={500}
                    value={requirement.value}
                    disabled={requirement.type === 'Follow' || disabled}
                    error={requirement.error}
                    onChange={event => {
                      const value = event.target.value
                      setTwitterRequirement(
                        twitterRequirement.map((requirement, i) => {
                          if (i === index) {
                            return { ...requirement, value }
                          }
                          return requirement
                        })
                      )
                    }}
                    onBlur={event => {
                      const value = event.target.value
                      let tweetValid = true
                      if (requirement.type !== 'JoinSpace' && requirement.type !== 'Follow') {
                        tweetValid = isTweetValid(value)
                      } else if (requirement.type === 'JoinSpace') {
                        tweetValid = isTweetSpaceValid(value)
                      }
                      const error = tweetValid ? undefined : 'Please enter a valid tweet link'
                      setTwitterRequirement(
                        twitterRequirement.map((requirement, i) => {
                          if (i === index) {
                            return { ...requirement, error }
                          }
                          return requirement
                        })
                      )
                    }}
                  />
                )}
              </Box>
            )
          })}
      </Stack>
      {enableTwitterRequirement && !disabled && (
        <Button
          variant="white"
          onClick={addNewTokenRequirement}
        >
          Add new requirement
        </Button>
      )}
    </Box>
  )
}
