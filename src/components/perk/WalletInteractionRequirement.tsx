import { api } from '@/utils/api'
import { Box, Button, Group, Select, Stack, Switch, TextInput, Text, NumberInput } from '@mantine/core'
import { create } from 'zustand'
import { type WalletInteraction, WalletInteractionBlockchain, InteractionPeriodType } from '@prisma/client'
import { uniqBy } from 'lodash'

type Props = {
  disabled: boolean
}

type WalletInteractionRequirementStore = {
  enableWalletInteractionRequirement: boolean
  setEnableWalletInteractionRequirement: (enableTokenRequirement: boolean) => void
  walletInteractions: WalletInteraction[]
  setWalletInteractions: (walletInteractions: WalletInteraction[]) => void
}

const useWalletInteractionRequirementStore = create<WalletInteractionRequirementStore>(set => ({
  enableWalletInteractionRequirement: false,
  setEnableWalletInteractionRequirement: enableWalletInteractionRequirement => set({ enableWalletInteractionRequirement }),
  walletInteractions: [
    {
      blockchain: 'Ethereum',
      interactionCount: 0,
      interactionPeriod: 0,
      contract: '',
      interactionPeriodType: 'Day',
      interaction: '',
    },
  ],
  setWalletInteractions: walletInteractions => set({ walletInteractions }),
}))

type WalletInteractionRequirementItemProps = WalletInteraction &
  Props & {
    onBlockChainChange: (blockchain: WalletInteractionBlockchain) => void
    onContractChange: (contract: string) => void
    onInteractionCountChange: (interactionCount: number) => void
    onInteractionPeriodChange: (interactionPeriod: number) => void
    onInteractionPeriodTypeChange: (interactionPeriodType: InteractionPeriodType) => void
    onInteractionChange: (interaction: string) => void
  }

const WalletInteractionRequirementItem = ({
  disabled,
  blockchain,
  contract,
  interactionCount,
  interaction,
  interactionPeriod,
  interactionPeriodType,
  onBlockChainChange,
  onContractChange,
  onInteractionCountChange,
  onInteractionPeriodChange,
  onInteractionPeriodTypeChange,
  onInteractionChange,
}: WalletInteractionRequirementItemProps) => {
  const blockchainOptions = Object.values(WalletInteractionBlockchain).map(type => ({ value: type, label: type }))
  const periodOptions = Object.values(InteractionPeriodType).map(type => ({ value: type, label: type }))
  const { data, refetch, error } = api.blockchain.getContractAbi.useQuery(
    {
      blockchain: blockchain,
      contractAddress: contract,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  )

  const functions = uniqBy(
    data?.filter(item => item.type === 'function'),
    'name'
  )

  const interactions = functions.map(item => ({ value: item.name ?? '', label: item.name ?? '' }))

  const fetchContractAbi = () => {
    if (contract !== '') {
      void refetch()
    }
  }

  return (
    <Stack
      w={500}
      mb={'md'}
    >
      <Select
        label="Blockchain"
        data={blockchainOptions}
        value={blockchain}
        disabled={disabled}
        onChange={value => {
          onBlockChainChange(value as WalletInteractionBlockchain)
        }}
      />
      <TextInput
        value={contract}
        label={'Contact address'}
        disabled={disabled}
        onChange={event => {
          onContractChange(event.target.value)
        }}
        onBlur={fetchContractAbi}
        error={error ? 'Invalid Contract' : null}
      />
      <Group>
        <Select
          label="User must have"
          data={interactions}
          value={interaction}
          disabled={disabled}
          searchable
          onChange={onInteractionChange}
          sx={{ flex: 1 }}
        />
        <NumberInput
          label="&nbsp;"
          placeholder={'0'}
          hideControls
          value={interactionCount}
          disabled={disabled}
          onChange={value => {
            onInteractionCountChange(Number(value))
          }}
          w={50}
        />
        <Text mt={24}>times</Text>
      </Group>
      <Group>
        <Text>in the last</Text>
        <NumberInput
          placeholder={'0'}
          hideControls
          value={interactionPeriod}
          disabled={disabled}
          onChange={value => {
            onInteractionPeriodChange(Number(value))
          }}
        />
        <Select
          data={periodOptions}
          value={interactionPeriodType}
          disabled={disabled}
          onChange={value => {
            onInteractionPeriodTypeChange(value as InteractionPeriodType)
          }}
        />
      </Group>
    </Stack>
  )
}

export const WalletInteractionRequirement = ({ disabled }: Props) => {
  const { enableWalletInteractionRequirement, setEnableWalletInteractionRequirement, walletInteractions, setWalletInteractions } =
    useWalletInteractionRequirementStore()

  const updateWalletInteractionByIndex = (index: number, walletInteraction: WalletInteraction) => {
    const result = walletInteractions.map((item, i) => {
      if (i === index) {
        return walletInteraction
      }
      return item
    })
    setWalletInteractions(result)
  }

  const addNewWalletInteraction = () => {
    setWalletInteractions([
      ...walletInteractions,
      {
        blockchain: 'Ethereum',
        interactionCount: 0,
        interactionPeriod: 0,
        contract: '',
        interactionPeriodType: 'Day',
        interaction: '',
      },
    ])
  }

  return (
    <Box>
      <Group>
        <h2>Wallet interaction</h2>
        <Switch
          disabled={disabled}
          checked={enableWalletInteractionRequirement}
          onChange={() => setEnableWalletInteractionRequirement(!enableWalletInteractionRequirement)}
        />
      </Group>
      {enableWalletInteractionRequirement &&
        walletInteractions.map((item, index) => {
          return (
            <WalletInteractionRequirementItem
              key={index}
              {...item}
              onBlockChainChange={blockchain => {
                updateWalletInteractionByIndex(index, { ...item, blockchain })
              }}
              onContractChange={contract => {
                updateWalletInteractionByIndex(index, { ...item, contract })
              }}
              onInteractionCountChange={interactionCount => {
                updateWalletInteractionByIndex(index, { ...item, interactionCount })
              }}
              onInteractionPeriodChange={interactionPeriod => {
                updateWalletInteractionByIndex(index, { ...item, interactionPeriod })
              }}
              onInteractionPeriodTypeChange={interactionPeriodType => {
                updateWalletInteractionByIndex(index, { ...item, interactionPeriodType })
              }}
              onInteractionChange={interaction => {
                updateWalletInteractionByIndex(index, { ...item, interaction })
              }}
              disabled={disabled}
            />
          )
        })}
      {enableWalletInteractionRequirement && !disabled && (
        <Button
          variant="white"
          onClick={addNewWalletInteraction}
        >
          Add another interaction
        </Button>
      )}
    </Box>
  )
}
