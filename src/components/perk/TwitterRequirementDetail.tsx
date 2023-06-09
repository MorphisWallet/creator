import { type TwitterRequirement } from '@prisma/client'
import { Card, Group, List, Text } from '@mantine/core'

export const TwitterRequirementDetail = ({ twitterRequirement }: { twitterRequirement: TwitterRequirement[] }) => {
  const showTwitterRequirement = twitterRequirement?.length > 0

  if (!showTwitterRequirement) {
    return null
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
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
          <g clipPath="url(#clip0_2025_15637)">
            <path
              d="M22 5.79917C21.2642 6.12583 20.4733 6.34583 19.6433 6.445C20.4908 5.9375 21.1417 5.13333 21.4475 4.175C20.655 4.645 19.7767 4.98667 18.8417 5.17083C18.0942 4.37333 17.0267 3.875 15.8467 3.875C13.1975 3.875 11.2508 6.34667 11.8492 8.9125C8.44 8.74167 5.41667 7.10833 3.3925 4.62583C2.3175 6.47 2.835 8.8825 4.66167 10.1042C3.99 10.0825 3.35667 9.89833 2.80417 9.59083C2.75917 11.4917 4.12167 13.27 6.095 13.6658C5.5175 13.8225 4.885 13.8592 4.24167 13.7358C4.76333 15.3658 6.27833 16.5517 8.075 16.585C6.35 17.9375 4.17667 18.5417 2 18.285C3.81583 19.4492 5.97333 20.1283 8.29 20.1283C15.9083 20.1283 20.2125 13.6942 19.9525 7.92333C20.7542 7.34417 21.45 6.62167 22 5.79917V5.79917Z"
              fill="#1DA1F2"
            />
          </g>
          <defs>
            <clipPath id="clip0_2025_15637">
              <rect
                width="20"
                height="20"
                fill="white"
                transform="translate(2 2)"
              />
            </clipPath>
          </defs>
        </svg>
        <Text>Twitter</Text>
      </Group>
      <List mt={'md'}>
        {twitterRequirement.map((item, index) => (
          <List.Item key={index}>
            Must {item.type} {item.value}
          </List.Item>
        ))}
      </List>
    </Card>
  )
}
