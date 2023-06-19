import { Text, Group, Select, Switch, TextInput, Avatar, NumberInput, Chip } from '@mantine/core'
import { create } from 'zustand'
import { Network } from 'alchemy-sdk'
import { useState } from 'react'
import { getNftContractMetadata, getTokenMetadata } from '@/libs'
import { TokenRequirementBlockChain, type TokenType } from '@prisma/client'

type TokenRequirementProps = {
  blockchain: TokenRequirementBlockChain
  setBlockchain: (blockchain: TokenRequirementBlockChain) => void
  tokenType: TokenType
  setTokenType: (tokenType: TokenType) => void
  contractAddress: string
  setContractAddress: (contractAddress: string) => void
  mustHoldAmount: number
  setMustHoldAmount: (mustHoldAmount: number) => void
  tokenSymbol: string
  setTokenSymbol: (tokenSymbol: string) => void
  tokenName: string
  setTokenName: (tokenName: string) => void
  logoUrl: string
  setLogoUrl: (logoUrl: string) => void
  disabled?: boolean
}

type TokenRequirementStore = {
  enableTokenRequirement: boolean
  setEnableTokenRequirement: (enableTokenRequirement: boolean) => void
  firstTokenRequirement: TokenRequirementProps
  secondTokenRequirementType: '' | 'AND' | 'OR'
  setSecondTokenRequirementType: (secondTokenRequirementType: '' | 'AND' | 'OR') => void
  secondTokenRequirement: TokenRequirementProps
  resetTokenRequirement: () => void
  setTokenRequirement: (
    tokenRequirement: Pick<
      TokenRequirementProps,
      'blockchain' | 'tokenName' | 'tokenSymbol' | 'tokenType' | 'mustHoldAmount' | 'logoUrl' | 'contractAddress'
    >,
    token: 'first' | 'second'
  ) => void
}

export const convertTokenRequirementNetworkToAlchemyNetwork = (network: TokenRequirementBlockChain): Network => {
  switch (network) {
    case 'Etherum':
      return Network.ETH_MAINNET
    case 'Polygon':
      return Network.MATIC_MAINNET
    default:
      return Network.ETH_MAINNET
  }
}

export const useTokenRequirementStore = create<TokenRequirementStore>(set => ({
  enableTokenRequirement: false,
  setEnableTokenRequirement: enableTokenRequirement => set({ enableTokenRequirement }),
  firstTokenRequirement: {
    blockchain: 'Etherum',
    disabled: false,
    setBlockchain: blockchain =>
      set(state => ({
        firstTokenRequirement: { ...state.firstTokenRequirement, blockchain },
      })),
    tokenType: 'Token',
    setTokenType: tokenType =>
      set(state => ({
        firstTokenRequirement: { ...state.firstTokenRequirement, tokenType },
      })),
    contractAddress: '',
    setContractAddress: contractAddress =>
      set(state => ({
        firstTokenRequirement: { ...state.firstTokenRequirement, contractAddress },
      })),
    mustHoldAmount: 0,
    setMustHoldAmount: mustHoldAmount =>
      set(state => ({
        firstTokenRequirement: { ...state.firstTokenRequirement, mustHoldAmount },
      })),
    tokenName: '',
    setTokenName: tokenName =>
      set(state => ({
        firstTokenRequirement: { ...state.firstTokenRequirement, tokenName },
      })),
    tokenSymbol: '',
    setTokenSymbol: tokenSymbol =>
      set(state => ({
        firstTokenRequirement: { ...state.firstTokenRequirement, tokenSymbol },
      })),
    logoUrl: '',
    setLogoUrl: logoUrl =>
      set(state => ({
        firstTokenRequirement: { ...state.firstTokenRequirement, logoUrl },
      })),
  },
  secondTokenRequirementType: '',
  setSecondTokenRequirementType: secondTokenRequirementType => set({ secondTokenRequirementType }),
  secondTokenRequirement: {
    blockchain: 'Etherum',
    disabled: false,
    setBlockchain: blockchain =>
      set(state => ({
        secondTokenRequirement: { ...state.secondTokenRequirement, blockchain },
      })),
    tokenType: 'Token',
    setTokenType: tokenType =>
      set(state => ({
        secondTokenRequirement: { ...state.secondTokenRequirement, tokenType },
      })),
    contractAddress: '',
    setContractAddress: contractAddress =>
      set(state => ({
        secondTokenRequirement: { ...state.secondTokenRequirement, contractAddress },
      })),
    mustHoldAmount: 0,
    setMustHoldAmount: mustHoldAmount =>
      set(state => ({
        secondTokenRequirement: { ...state.secondTokenRequirement, mustHoldAmount },
      })),
    tokenName: '',
    setTokenName: tokenName =>
      set(state => ({
        secondTokenRequirement: { ...state.secondTokenRequirement, tokenName },
      })),
    tokenSymbol: '',
    setTokenSymbol: tokenSymbol =>
      set(state => ({
        secondTokenRequirement: { ...state.secondTokenRequirement, tokenSymbol },
      })),
    logoUrl: '',
    setLogoUrl: logoUrl =>
      set(state => ({
        secondTokenRequirement: { ...state.secondTokenRequirement, logoUrl },
      })),
  },
  resetTokenRequirement: () =>
    set(state => ({
      ...state,
      enableTokenRequirement: false,
      firstTokenRequirement: {
        ...state.firstTokenRequirement,
        blockchain: 'Etherum',
        tokenType: 'Token',
        contractAddress: '',
        mustHoldAmount: 0,
        tokenName: '',
        tokenSymbol: '',
        logoUrl: '',
      },
      secondTokenRequirementType: '',
      secondTokenRequirement: {
        ...state.secondTokenRequirement,
        blockchain: 'Etherum',
        tokenType: 'Token',
        contractAddress: '',
        mustHoldAmount: 0,
        tokenName: '',
        tokenSymbol: '',
        logoUrl: '',
      },
    })),
  setTokenRequirement: (tokenRequirement, token) =>
    set(state => ({
      ...state,
      [`${token}TokenRequirement`]: {
        ...state[`${token}TokenRequirement`],
        ...tokenRequirement,
      },
    })),
}))

const TokenRequirementForm = ({
  tokenType,
  setTokenType,
  contractAddress,
  setContractAddress,
  mustHoldAmount,
  setMustHoldAmount,
  setBlockchain,
  blockchain,
  setTokenName,
  tokenSymbol,
  setTokenSymbol,
  logoUrl,
  setLogoUrl,
  disabled,
}: TokenRequirementProps) => {
  const [contractError, setContractError] = useState('')
  const tokenContractTypes = [
    {
      value: 'Token',
      label: 'Token',
    },
    {
      value: 'NFT',
      label: 'NFT',
    },
  ]
  const blockchainSelectData = [
    {
      value: TokenRequirementBlockChain.Etherum,
      label: 'Ethereum',
    },
    {
      value: TokenRequirementBlockChain.Polygon,
      label: 'Polygon',
    },
  ]
  const getTokenContractData = async () => {
    if (!contractAddress) return
    try {
      setContractError('')
      if (tokenType === 'Token') {
        const network = convertTokenRequirementNetworkToAlchemyNetwork(blockchain)
        const data = await getTokenMetadata(network, contractAddress)
        setLogoUrl(data.logo ?? '')
        setTokenName(data.name ?? '')
        setTokenSymbol(data.symbol ?? '')
      } else if (tokenType === 'NFT') {
        const network = convertTokenRequirementNetworkToAlchemyNetwork(blockchain)
        const data = await getNftContractMetadata(network, contractAddress)
        setLogoUrl(data.openSea?.imageUrl ?? '')
        setTokenName(data.name ?? '')
        setTokenSymbol(data.symbol ?? '')
      }
    } catch (error) {
      console.error(error)
      setContractError('Invalid Contract')
    }
  }

  return (
    <>
      <Group align={'flex-start'}>
        <Select
          label="Blockchain"
          data={blockchainSelectData}
          value={blockchain}
          onChange={setBlockchain}
          disabled={disabled}
        />
        <Select
          label="Token Type"
          data={tokenContractTypes}
          value={tokenType}
          onChange={setTokenType}
          disabled={disabled}
        />
        <TextInput
          label="Token’s contract address"
          placeholder="Token’s contract address"
          w={400}
          disabled={disabled}
          value={contractAddress}
          onChange={event => setContractAddress(event.currentTarget.value)}
          onBlur={() => void getTokenContractData()}
          error={contractError}
        />
      </Group>
      <Group align="center">
        <Text>User must hold</Text>
        <NumberInput
          placeholder={'0'}
          hideControls
          value={mustHoldAmount}
          disabled={disabled}
          onChange={setMustHoldAmount}
        />
        {logoUrl && (
          <Avatar
            src={logoUrl}
            alt="token logo"
            radius="xl"
          />
        )}
        <Text>{tokenSymbol}</Text>
      </Group>
    </>
  )
}

export const TokenRequirement = ({ disabled }: { disabled?: boolean }) => {
  const {
    enableTokenRequirement,
    setEnableTokenRequirement,
    firstTokenRequirement,
    secondTokenRequirement,
    secondTokenRequirementType,
    setSecondTokenRequirementType,
  } = useTokenRequirementStore()

  return (
    <>
      <Group>
        <h2>Token holders</h2>
        <Switch
          checked={enableTokenRequirement}
          disabled={disabled}
          onChange={() => setEnableTokenRequirement(!enableTokenRequirement)}
        />
      </Group>
      {enableTokenRequirement && (
        <>
          <TokenRequirementForm
            {...firstTokenRequirement}
            disabled={disabled}
          />
          <Chip.Group
            multiple={false}
            value={secondTokenRequirementType}
            onChange={setSecondTokenRequirementType}
          >
            <Group>
              <Chip
                value=""
                disabled={disabled}
              >
                No Additional Token
              </Chip>
              <Chip
                value="AND"
                disabled={disabled}
              >
                And
              </Chip>
              <Chip
                value="OR"
                disabled={disabled}
              >
                Or
              </Chip>
            </Group>
          </Chip.Group>
          {secondTokenRequirementType !== '' && (
            <TokenRequirementForm
              {...secondTokenRequirement}
              disabled={disabled}
            />
          )}
        </>
      )}
    </>
  )
}
