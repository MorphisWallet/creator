import { z } from 'zod'
import { zu } from 'zod_utilz'
import { WalletInteractionBlockchain } from '@prisma/client'
import { env } from '@/env.mjs'

export const getContractAbiInputSchema = z.object({
  blockchain: z.nativeEnum(WalletInteractionBlockchain),
  contractAddress: z.string(),
})

export const getContractAbi = async (input: z.infer<typeof getContractAbiInputSchema>) => {
  const abiSchema = z.array(
    z.object({
      type: z.string().nonempty(),
      name: z.string().nonempty().optional(),
    })
  )
  const apiKey = input.blockchain === WalletInteractionBlockchain.Ethereum ? env.ETHERSCAN_API_KEY : env.POLYGONSCAN_API_KEY
  const requestBaseUrl =
    input.blockchain === WalletInteractionBlockchain.Ethereum ? 'https://api.etherscan.io/api' : 'https://api.polygonscan.com/api'
  const responseSchema = z.object({
    status: z.literal('1'),
    result: zu.stringToJSON(),
  })

  const query = new URLSearchParams({
    module: 'contract',
    action: 'getabi',
    address: input.contractAddress,
    apikey: apiKey,
  }).toString()

  const response = await fetch(`${requestBaseUrl}?${query}`, {
    method: 'GET',
  })

  const result = (await response.json()) as unknown
  const parsedResult = responseSchema.parse(result)

  return abiSchema.parse(parsedResult.result)
}

const verifyContractFunctionInputSchema = getContractAbiInputSchema.extend({
  functionNames: z.array(z.string().nonempty()),
})

export const verifyContractFunction = async (input: z.infer<typeof verifyContractFunctionInputSchema>) => {
  const abiSchema = await getContractAbi(input)
  const abiFunctions = abiSchema.filter(abi => abi.type === 'function')
  const functionNames = input.functionNames
  const isValid = functionNames.every(functionName => abiFunctions.some(abi => abi.name === functionName))
  if (!isValid) {
    throw new Error(`Invalid function names: ${functionNames.join(', ')}`)
  }
  return true
}
