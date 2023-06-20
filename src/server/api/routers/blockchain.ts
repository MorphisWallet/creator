import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { z } from 'zod'
import { WalletInteractionBlockchain } from '@prisma/client'
import { env } from '@/env.mjs'
import { zu } from 'zod_utilz'

export const blockchainRouter = createTRPCRouter({
  getContractAbi: protectedProcedure
    .input(
      z.object({
        blockchain: z.nativeEnum(WalletInteractionBlockchain),
        contractAddress: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { blockchain, contractAddress } = input
      const abiSchema = z.array(
        z.object({
          type: z.string().nonempty(),
          name: z.string().nonempty().optional(),
        })
      )

      const apiKey = blockchain === WalletInteractionBlockchain.Etherum ? env.ETHERSCAN_API_KEY : env.POLYGONSCAN_API_KEY
      const requestBaseUrl =
        blockchain === WalletInteractionBlockchain.Etherum ? 'https://api.etherscan.io/api' : 'https://api.polygonscan.com/api'
      const responseSchema = z.object({
        status: z.literal('1'),
        result: zu.stringToJSON(),
      })

      const query = new URLSearchParams({
        module: 'contract',
        action: 'getabi',
        address: contractAddress,
        apikey: apiKey,
      }).toString()

      const response = await fetch(`${requestBaseUrl}?${query}`, {
        method: 'GET',
      })

      const result = (await response.json()) as unknown
      const parsedResult = responseSchema.parse(result)

      return abiSchema.parse(parsedResult.result)
    }),
})
