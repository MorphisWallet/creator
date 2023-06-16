import { z } from 'zod'
import { PerkBlockchain, PerkType, TokenRequirementBlockChain, TokenType, PerkStatus } from '@prisma/client'

export const createNftAllowListPerkSchema = z.object({
  perkId: z.string().optional(),
  name: z.string().max(50),
  description: z.string().max(1000),
  blockchain: z.nativeEnum(PerkBlockchain),
  perkType: z.nativeEnum(PerkType),
  spot: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.nativeEnum(PerkStatus),
  totalSupply: z.number().optional(),
  priceSymbol: z.string().optional(),
  price: z.number().optional(),
  tokenHolderRequirement: z
    .object({
      mustHoldTokenContracts: z.array(z.string()),
      tokenRequirement: z
        .array(
          z.object({
            tokenType: z.nativeEnum(TokenType),
            blockchain: z.nativeEnum(TokenRequirementBlockChain),
            contractAddress: z.string().nonempty(),
            mustHoldAmount: z.number().min(0),
            tokenSymbol: z.string().optional(),
            tokenName: z.string().optional(),
            logoUrl: z.string().optional(),
          })
        )
        .min(1),
    })
    .optional(),
})
