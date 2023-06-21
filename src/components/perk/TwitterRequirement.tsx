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
                    onChange={event => {
                      setTwitterRequirement(
                        twitterRequirement.map((requirement, i) => {
                          if (i === index) {
                            return { ...requirement, value: event.target.value }
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
