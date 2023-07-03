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
    <Stack>
      <Group>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_2280_5683)">
            <path
              d="M22 5.79917C21.2642 6.12583 20.4733 6.34583 19.6433 6.445C20.4908 5.9375 21.1417 5.13333 21.4475 4.175C20.655 4.645 19.7767 4.98667 18.8417 5.17083C18.0942 4.37333 17.0267 3.875 15.8467 3.875C13.1975 3.875 11.2508 6.34667 11.8492 8.9125C8.44 8.74167 5.41667 7.10833 3.3925 4.62583C2.3175 6.47 2.835 8.8825 4.66167 10.1042C3.99 10.0825 3.35667 9.89833 2.80417 9.59083C2.75917 11.4917 4.12167 13.27 6.095 13.6658C5.5175 13.8225 4.885 13.8592 4.24167 13.7358C4.76333 15.3658 6.27833 16.5517 8.075 16.585C6.35 17.9375 4.17667 18.5417 2 18.285C3.81583 19.4492 5.97333 20.1283 8.29 20.1283C15.9083 20.1283 20.2125 13.6942 19.9525 7.92333C20.7542 7.34417 21.45 6.62167 22 5.79917Z"
              fill="#1DA1F2"
            />
          </g>
          <defs>
            <clipPath id="clip0_2280_5683">
              <rect
                width="20"
                height="20"
                fill="white"
                transform="translate(2 2)"
              />
            </clipPath>
          </defs>
        </svg>
        <Text>Twitter requirements</Text>
        <Switch
          disabled={disabled}
          checked={enableTwitterRequirement}
          onChange={() => setEnableTwitterRequirement(!enableTwitterRequirement)}
        />
      </Group>
      {enableTwitterRequirement && (
        <Stack>
          {twitterRequirement.map((requirement, index) => {
            return (
              <Box key={index}>
                <Text>Must...</Text>
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
      )}
      {enableTwitterRequirement && !disabled && (
        <Button
          variant="white"
          onClick={addNewTokenRequirement}
          w={200}
        >
          Add new requirement
        </Button>
      )}
    </Stack>
  )
}
