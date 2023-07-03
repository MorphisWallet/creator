import { Group, Stack, Text, Image, Box, Card, List, Anchor } from '@mantine/core'
import { formatDate } from '@/utils/date'
import { api } from '@/utils/api'
import { useTwitterRequirementStore } from '@/components/perk/TwitterRequirement'
import { useTokenRequirementStore } from '@/components/perk/TokenRequirement'

type Props = {
  perkName: string
  perkDescription: string
  perkImage: string
  spotsAvailable: number
  startDate?: Date
  endDate?: Date
}

const TwitterRequirementPreview = () => {
  const { twitterRequirement } = useTwitterRequirementStore()
  if (twitterRequirement.length === 0 || twitterRequirement[0]?.value === '') return null

  return (
    <Card
      padding="md"
      radius="md"
      withBorder
    >
      <Group>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_2016_16019)">
            <path
              d="M22 5.79917C21.2642 6.12583 20.4733 6.34583 19.6433 6.445C20.4908 5.9375 21.1417 5.13333 21.4475 4.175C20.655 4.645 19.7767 4.98667 18.8417 5.17083C18.0942 4.37333 17.0267 3.875 15.8467 3.875C13.1975 3.875 11.2508 6.34667 11.8492 8.9125C8.44 8.74167 5.41667 7.10833 3.3925 4.62583C2.3175 6.47 2.835 8.8825 4.66167 10.1042C3.99 10.0825 3.35667 9.89833 2.80417 9.59083C2.75917 11.4917 4.12167 13.27 6.095 13.6658C5.5175 13.8225 4.885 13.8592 4.24167 13.7358C4.76333 15.3658 6.27833 16.5517 8.075 16.585C6.35 17.9375 4.17667 18.5417 2 18.285C3.81583 19.4492 5.97333 20.1283 8.29 20.1283C15.9083 20.1283 20.2125 13.6942 19.9525 7.92333C20.7542 7.34417 21.45 6.62167 22 5.79917Z"
              fill="#1DA1F2"
            />
          </g>
          <defs>
            <clipPath id="clip0_2016_16019">
              <rect
                width="20"
                height="20"
                fill="white"
                transform="translate(2 2)"
              />
            </clipPath>
          </defs>
        </svg>
        <List>
          {twitterRequirement.map((item, index) => {
            let link
            switch (item.type) {
              case 'Follow':
                link = (
                  <>
                    follow{' '}
                    <Anchor
                      href={`https://twitter.com/${item.value.replace('@', '')}`}
                      target="_blank"
                    >
                      {item.value}
                    </Anchor>
                  </>
                )
                break
              case 'JoinSpace':
                link = (
                  <>
                    join{' '}
                    <Anchor
                      href={item.value}
                      target="_blank"
                    >
                      this space
                    </Anchor>
                  </>
                )
                break
              default:
                link = (
                  <>
                    {item.type.toLowerCase()}{' '}
                    <Anchor
                      href={item.value}
                      target="_blank"
                    >
                      this tweet
                    </Anchor>
                  </>
                )
            }
            return <List.Item key={index}>Must {link}</List.Item>
          })}
        </List>
      </Group>
    </Card>
  )
}

const TokenHolderRequirementPreview = () => {
  const { firstTokenRequirement, secondTokenRequirement, secondTokenRequirementType, enableTokenRequirement } = useTokenRequirementStore()
  let tokenRequirementText = ''
  if (firstTokenRequirement.contractAddress) {
    tokenRequirementText = `Must hold at least ${firstTokenRequirement.mustHoldAmount} ${firstTokenRequirement.tokenSymbol}`
  }
  if (secondTokenRequirement.contractAddress) {
    const prefix = secondTokenRequirementType === 'AND' ? 'and' : 'or'
    tokenRequirementText = `${tokenRequirementText} ${prefix} hold at least ${secondTokenRequirement.mustHoldAmount} ${secondTokenRequirement.tokenSymbol}`
  }
  if (tokenRequirementText === '' || !enableTokenRequirement) return null
  return (
    <Card
      padding="md"
      radius="md"
      withBorder
    >
      <Group>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.25 8.39719V7.875C17.25 5.52375 13.7034 3.75 9 3.75C4.29656 3.75 0.75 5.52375 0.75 7.875V11.625C0.75 13.5834 3.21094 15.1397 6.75 15.6056V16.125C6.75 18.4762 10.2966 20.25 15 20.25C19.7034 20.25 23.25 18.4762 23.25 16.125V12.375C23.25 10.4344 20.8669 8.87625 17.25 8.39719ZM5.25 13.7691C3.41344 13.2562 2.25 12.4116 2.25 11.625V10.3059C3.015 10.8478 4.03969 11.2847 5.25 11.5781V13.7691ZM12.75 11.5781C13.9603 11.2847 14.985 10.8478 15.75 10.3059V11.625C15.75 12.4116 14.5866 13.2562 12.75 13.7691V11.5781ZM11.25 18.2691C9.41344 17.7562 8.25 16.9116 8.25 16.125V15.7341C8.49656 15.7434 8.74594 15.75 9 15.75C9.36375 15.75 9.71906 15.7378 10.0678 15.7172C10.4552 15.8559 10.8499 15.9736 11.25 16.0697V18.2691ZM11.25 14.0859C10.5051 14.196 9.75302 14.2508 9 14.25C8.24698 14.2508 7.49493 14.196 6.75 14.0859V11.8556C7.49604 11.9528 8.24765 12.0011 9 12C9.75235 12.0011 10.504 11.9528 11.25 11.8556V14.0859ZM17.25 18.5859C15.758 18.8047 14.242 18.8047 12.75 18.5859V16.35C13.4958 16.4503 14.2475 16.5004 15 16.5C15.7523 16.5011 16.504 16.4528 17.25 16.3556V18.5859ZM21.75 16.125C21.75 16.9116 20.5866 17.7562 18.75 18.2691V16.0781C19.9603 15.7847 20.985 15.3478 21.75 14.8059V16.125Z"
            fill="#0062FF"
          />
        </svg>
        <Text>{tokenRequirementText}</Text>
      </Group>
    </Card>
  )
}

export const AllowListPerkPreview = ({ perkName, perkDescription, perkImage, spotsAvailable, endDate, startDate }: Props) => {
  const { data } = api.project.getProjectDetail.useQuery()

  return (
    <Box>
      <Text
        size="xl"
        fw={'bold'}
        mb={'xl'}
      >
        Preview of your perk 👀
      </Text>
      <Group
        noWrap
        align="flex-start"
      >
        <Image
          fit="cover"
          height={240}
          width={307}
          src={perkImage}
          withPlaceholder
          radius="md"
          alt={''}
          sx={{ flexShrink: 0 }}
        />
        <Stack spacing={'xs'}>
          <Text>Offered by {data?.name}</Text>
          <Text
            fw={'bold'}
            size={'xl'}
          >
            {perkName}
          </Text>
          <Text color={'dimmed'}>{perkDescription}</Text>
        </Stack>
      </Group>
      <Group
        position="apart"
        mt={'sm'}
      >
        <Text>
          {spotsAvailable}/{spotsAvailable} spots available to claim
        </Text>
        {startDate && endDate && (
          <Text>
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
        )}
      </Group>
      <Text
        size={'xl'}
        fw={'bold'}
        mt={'xl'}
        mb={'md'}
      >
        How to Join
      </Text>
      <Stack>
        <TwitterRequirementPreview />
        <TokenHolderRequirementPreview />
      </Stack>
    </Box>
  )
}
