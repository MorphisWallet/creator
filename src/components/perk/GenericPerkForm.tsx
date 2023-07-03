import { type Perk, PerkBlockchain, PerkStatus, PerkType, GenericPerkType } from '@prisma/client'
import { Button, Card, Group, Select, Stack, Textarea, TextInput, Text, Box, Chip } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { FeaturedImage } from '@/components/perk/FeaturedImage'
import { TokenRequirement, useTokenRequirementStore } from '@/components/perk/TokenRequirement'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'
import { api } from '@/utils/api'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { createGenericPerkSchema, type CreateGenericPerkSchemaType, type TwitterRequirementSchemaType } from '@/schemas'
import { type TokenRequirementSchemaType } from '@/server/api/routers/perk'
import { modals } from '@mantine/modals'
import { TwitterRequirement, useTwitterRequirementStore } from '@/components/perk/TwitterRequirement'
import { z } from 'zod'
import { GenericPerkPreview } from '@/components/perk/GenericPerkPreview'

type Props = {
  perk?: Perk
}

type FormValues = {
  name: string
  description: string
  blockchain: PerkBlockchain
  linkToClaim: string
  genericPerkType: GenericPerkType | ''
  startDate?: Date
  endDate?: Date
  featuredImageUrl: string
}

export const GenericPerkForm = ({ perk }: Props) => {
  const isPublished = perk?.status === 'Published'
  const perkBlockchains = Object.values(PerkBlockchain)
  const form = useForm<FormValues>({
    initialValues: {
      name: perk?.name ?? '',
      description: perk?.description ?? '',
      blockchain: perk?.blockchain ?? 'Ethereum',
      startDate: perk?.startDate,
      endDate: perk?.endDate,
      featuredImageUrl: perk?.featuredImageUrl ?? '',
      linkToClaim: perk?.generic?.link ?? '',
      genericPerkType: perk?.generic?.type ?? '',
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
      blockchain: value => (!perkBlockchains.includes(value) ? 'Please select a blockchain' : null),
      startDate: value => (value && dayjs(value).isValid() ? null : 'Must provide a valid date'),
      endDate: (value, values) => {
        if (value && dayjs(value).isValid()) {
          if (dayjs(value).isBefore(values.startDate)) {
            return 'End date must be after start date'
          }
          return null
        }
        return 'Must provide a valid date'
      },
      linkToClaim: value => (z.string().url().safeParse(value).success ? null : 'Must provide a valid URL'),
    },
  })

  const blockchainSelectData = perkBlockchains.map(blockchain => ({
    value: blockchain,
    label: blockchain,
  }))

  const genericPerkTypes = Object.values(GenericPerkType)
  const genericPerkTypeSelectData = genericPerkTypes.map(type => ({
    value: type,
    label: type,
  }))

  const { mutate, isLoading } = api.perk.createGenericPerk.useMutation({
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
        message: data.message,
        color: 'green',
      })
      void goBack()
    },
  })

  const { push } = useRouter()
  const goBack = () => {
    if (isPublished) {
      void push(`/dashboard/generic/${perk?.id}`)
    } else {
      void push('/dashboard/perks')
    }
  }

  const {
    enableTokenRequirement,
    secondTokenRequirementType,
    firstTokenRequirement,
    secondTokenRequirement,
    resetTokenRequirement,
    setEnableTokenRequirement,
    setSecondTokenRequirementType,
    setTokenRequirement,
  } = useTokenRequirementStore()

  const { twitterRequirement, enableTwitterRequirement, resetTwitterRequirement, setTwitterRequirement, setEnableTwitterRequirement } =
    useTwitterRequirementStore()

  useEffect(() => {
    resetTokenRequirement()
    resetTwitterRequirement()
    if (perk) {
      const { tokenHolderRequirement, twitterRequirement } = perk
      if (tokenHolderRequirement) {
        setEnableTokenRequirement(true)
        if (tokenHolderRequirement.tokenRequirement[0]) {
          setSecondTokenRequirementType(tokenHolderRequirement.mustHoldTokenContracts.length > 0 ? 'AND' : 'OR')
          const secondTokenRequirement = tokenHolderRequirement.tokenRequirement[1]
          if (!secondTokenRequirement) {
            setSecondTokenRequirementType('')
          }

          const currentTokenRequirement = tokenHolderRequirement.tokenRequirement[0]
          setTokenRequirement(
            {
              tokenType: currentTokenRequirement.tokenType,
              tokenSymbol: currentTokenRequirement.tokenSymbol ?? '',
              mustHoldAmount: Number(currentTokenRequirement.mustHoldAmount),
              contractAddress: currentTokenRequirement.contractAddress,
              logoUrl: currentTokenRequirement.logoUrl ?? '',
              tokenName: currentTokenRequirement.tokenName ?? '',
              blockchain: currentTokenRequirement.blockchain,
            },
            'first'
          )
        }
        if (tokenHolderRequirement.tokenRequirement[1]) {
          const currentTokenRequirement = tokenHolderRequirement.tokenRequirement[1]
          setTokenRequirement(
            {
              tokenType: currentTokenRequirement.tokenType,
              tokenSymbol: currentTokenRequirement.tokenSymbol ?? '',
              mustHoldAmount: Number(currentTokenRequirement.mustHoldAmount),
              contractAddress: currentTokenRequirement.contractAddress,
              logoUrl: currentTokenRequirement.logoUrl ?? '',
              tokenName: currentTokenRequirement.tokenName ?? '',
              blockchain: currentTokenRequirement.blockchain,
            },
            'second'
          )
        }
      }

      if (twitterRequirement && twitterRequirement.length > 0) {
        setEnableTwitterRequirement(true)
        setTwitterRequirement(twitterRequirement)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createOrUpdatePerk = (data: Partial<CreateGenericPerkSchemaType>) => {
    if (!data.genericPerkType) {
      return notifications.show({
        title: 'Error',
        message: 'Please select a perk type',
        color: 'red',
      })
    }

    const resultToParse = {
      ...data,
      perkType: PerkType.Generic,
    }

    if (perk?.id) {
      resultToParse.perkId = perk.id
    }

    if (enableTokenRequirement) {
      const tokenRequirement: TokenRequirementSchemaType[] = [firstTokenRequirement]
      if (secondTokenRequirementType !== '') {
        tokenRequirement.push(secondTokenRequirement)
      }
      const hasEmptyContractAddress = tokenRequirement.some(token => token.contractAddress === '')
      if (hasEmptyContractAddress) {
        return notifications.show({
          title: 'Error',
          message: 'Please fill in all the contract addresses',
          color: 'red',
        })
      }
      const contractAddresses = tokenRequirement.map(token => token.contractAddress)
      const mustHoldTokenContracts = secondTokenRequirementType === 'AND' ? contractAddresses : []
      resultToParse.tokenHolderRequirement = {
        mustHoldTokenContracts,
        tokenRequirement,
      }
    }

    if (enableTwitterRequirement) {
      resultToParse.twitterRequirement = twitterRequirement.filter(requirement => requirement.type !== '') as TwitterRequirementSchemaType[]
    }

    const zodResult = createGenericPerkSchema.parse(resultToParse)

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
          createOrUpdatePerk({
            ...form.values,
            status: PerkStatus.Draft,
            genericPerkType: form.values.genericPerkType as GenericPerkType,
          })
        }
      },
    })

  return (
    <Group align="flex-start">
      <Box sx={{ flex: 1 }}>
        <form
          onSubmit={form.onSubmit(values => {
            createOrUpdatePerk({
              ...values,
              status: PerkStatus.Published,
              genericPerkType: values.genericPerkType as GenericPerkType,
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
                About the perk 🔥
              </Text>
              <Stack>
                <Box>
                  <Text
                    size={'sm'}
                    fw={500}
                    mb={4}
                  >
                    Perk Type
                  </Text>
                  <Chip.Group
                    multiple={false}
                    {...form.getInputProps('genericPerkType')}
                  >
                    <Group>
                      {genericPerkTypeSelectData.map((item, index) => (
                        <Chip
                          key={index}
                          value={item.value}
                        >
                          {item.label}
                        </Chip>
                      ))}
                    </Group>
                  </Chip.Group>
                </Box>
                <Select
                  label="Blockchain"
                  required
                  data={blockchainSelectData}
                  {...form.getInputProps('blockchain')}
                  disabled={isPublished}
                />
                <TextInput
                  label="Name of the Perk"
                  placeholder="Name of the Perk"
                  required
                  {...form.getInputProps('name')}
                  disabled={isPublished}
                />
                <Textarea
                  label="Description"
                  placeholder="The description of the perk"
                  required
                  {...form.getInputProps('description')}
                  minRows={6}
                />
                <TextInput
                  label="Link to claim"
                  placeholder="Link to claim"
                  required
                  {...form.getInputProps('linkToClaim')}
                  disabled={isPublished}
                />
                <Group align={'flex-start'}>
                  <DateTimePicker
                    label="Perk start date"
                    placeholder="Pick date and time"
                    required
                    valueFormat="DD MMMM YYYY HH:mm"
                    w={200}
                    {...form.getInputProps('startDate')}
                  />
                  <DateTimePicker
                    label="Perk end date"
                    placeholder="Pick date and time"
                    valueFormat="DD MMMM YYYY HH:mm"
                    w={200}
                    {...form.getInputProps('endDate')}
                    required
                  />
                </Group>
                <FeaturedImage
                  initialImageUrl={form.values.featuredImageUrl}
                  onImageUrlChange={url => form.setFieldValue('featuredImageUrl', url)}
                  disabled={isPublished}
                />
              </Stack>
            </Card>
            <Text
              size="xl"
              fw={'bold'}
            >
              Requirements ✨
            </Text>
            <Card
              padding="md"
              radius="md"
              withBorder
            >
              <TwitterRequirement disabled={isPublished} />
            </Card>
            <Card
              padding="md"
              radius="md"
              withBorder
            >
              <TokenRequirement disabled={isPublished} />
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
      <Card
        padding="lg"
        radius="md"
        withBorder
        w={600}
      >
        <GenericPerkPreview
          perkName={form.values.name}
          perkDescription={form.values.description}
          endDate={form.values.endDate}
          startDate={form.values.startDate}
          perkImage={form.values.featuredImageUrl}
        />
      </Card>
    </Group>
  )
}
