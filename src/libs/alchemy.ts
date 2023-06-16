import { Alchemy, type Network } from 'alchemy-sdk'
import { env } from '@/env.mjs'
import { NftTokenType } from 'alchemy-sdk'

export const getNftContractMetadata = async (network: Network, contractAddress: string) => {
  const settings = {
    apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: network,
  }
  const alchemy = new Alchemy(settings)
  const data = await alchemy.nft.getContractMetadata(contractAddress)
  const supportedTokenStandard = [NftTokenType.ERC721, NftTokenType.ERC1155]
  if (!supportedTokenStandard.includes(data.tokenType)) {
    throw new Error('Invalid contract type')
  }
  return data
}

export const getTokenMetadata = (network: Network, contractAddress: string) => {
  const settings = {
    apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: network,
  }
  const alchemy = new Alchemy(settings)
  return alchemy.core.getTokenMetadata(contractAddress)
}
