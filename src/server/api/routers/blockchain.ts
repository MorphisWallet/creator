import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { getContractAbi, getContractAbiInputSchema } from '@/libs/contract'

export const blockchainRouter = createTRPCRouter({
  getContractAbi: protectedProcedure.input(getContractAbiInputSchema).query(({ input }) => {
    return getContractAbi(input)
  }),
})
