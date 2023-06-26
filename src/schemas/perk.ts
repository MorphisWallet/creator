import { z } from 'zod'
import {
  PerkBlockchain,
  PerkType,
  TokenRequirementBlockChain,
  TokenType,
  PerkStatus,
  TwitterRequirementType,
  WalletInteractionBlockchain,
  InteractionPeriodType,
} from '@prisma/client'

export const twitterRequirementSchema = z.object({
  type: z.nativeEnum(TwitterRequirementType),
  value: z.string().nonempty(),
})

export type TwitterRequirementSchemaType = z.infer<typeof twitterRequirementSchema>

export const walletInteractionRequirementSchema = z.object({
  blockchain: z.nativeEnum(WalletInteractionBlockchain),
  contract: z.string().nonempty(),
  interaction: z.string().nonempty(),
  interactionCount: z.number().min(0),
  interactionPeriod: z.number().min(0),
  interactionPeriodType: z.nativeEnum(InteractionPeriodType),
})

export const createNftAllowListPerkSchema = z.object({
  perkId: z.string().optional(),
  name: z.string().max(50),
  description: z.string().max(1000),
  blockchain: z.nativeEnum(PerkBlockchain),
  perkType: z.nativeEnum(PerkType),
  featuredImageUrl: z.string(),
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
  twitterRequirement: z.array(twitterRequirementSchema).optional(),
  walletInteraction: z.array(walletInteractionRequirementSchema).optional(),
})
