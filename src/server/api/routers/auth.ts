import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { type Hex, recoverMessageAddress } from 'viem'
import { EthereumVerificationMessage } from '@/constants'
import { prisma } from '@/server/db'

export const authRouter = createTRPCRouter({
  verifyEthereumAddress: protectedProcedure
    .input(
      z.object({
        signature: z.string(),
        address: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { address, signature } = input
      const recoveredAddress = await recoverMessageAddress({
        message: EthereumVerificationMessage,
        signature: signature as Hex,
      })
      if (recoveredAddress !== address) {
        throw new Error('Signature not matched')
      }
      const existingAccount = await prisma.account.findFirst({
        where: {
          providerAccountId: address,
        },
      })

      if (existingAccount) {
        return new Error('This address has already been verified')
      }

      const isAdminAddress = await prisma.adminWallet.findFirst({
        where: {
          address: address,
        },
      })

      const { user } = ctx.session
      await prisma.account.create({
        data: {
          userId: user.id,
          type: 'credentials',
          providerAccountId: address,
          provider: 'Ethereum',
        },
      })

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          address: address,
          role: isAdminAddress ? 'Admin' : 'User',
        },
      })

      return {
        message: 'Address Verified',
      }
    }),
})
