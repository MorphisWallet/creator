import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { prisma } from '@/server/db'
import { PerkStatus, TokenRequirementBlockChain, TokenType } from '@prisma/client'
import { createPerkOnAWSService, getNftContractMetadata, getTokenMetadata } from '@/libs'
import { convertTokenRequirementNetworkToAlchemyNetwork } from '@/components/perk/TokenRequirement'
import { createGenericPerkSchema, createNftAllowListPerkSchema } from '@/schemas'
import { verifyContractFunction } from '@/libs/contract'

const tokenRequirementSchema = z.object({
  tokenType: z.nativeEnum(TokenType),
  blockchain: z.nativeEnum(TokenRequirementBlockChain),
  contractAddress: z.string(),
  mustHoldAmount: z.number(),
  tokenSymbol: z.string().optional(),
  tokenName: z.string().optional(),
  logoUrl: z.string().optional(),
})

export type TokenRequirementSchemaType = z.infer<typeof tokenRequirementSchema>

export type DisplayStatus = 'published' | 'draft' | 'expired'

export const perkRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session

    const perks = await prisma.perk.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    })

    return {
      perks,
    }
  }),
  createAllowListPerk: protectedProcedure.input(createNftAllowListPerkSchema).mutation(async ({ input, ctx }) => {
    const { user } = ctx.session
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    })

    /**user must have Twitter account to create perk*/
    await prisma.account.findFirstOrThrow({
      where: {
        userId: user.id,
        provider: 'twitter',
      },
    })

    const promises: Promise<unknown>[] = []
    /**Check token requirement contract validity*/
    const tokenRequirements = input.tokenHolderRequirement?.tokenRequirement ?? []
    const contractPromises = tokenRequirements.map(tokenRequirement => {
      const network = convertTokenRequirementNetworkToAlchemyNetwork(tokenRequirement.blockchain)
      if (tokenRequirement.tokenType === 'Token') {
        return getTokenMetadata(network, tokenRequirement.contractAddress)
      } else if (tokenRequirement.tokenType === 'NFT') {
        return getNftContractMetadata(network, tokenRequirement.contractAddress)
      }
      return Promise.resolve()
    })
    promises.push(...contractPromises)
    /** Check wallet interaction contract and interaction validity*/
    const walletInteraction =
      input.walletInteraction?.map(interaction => ({
        contractAddress: interaction.contract,
        functionNames:
          input.walletInteraction
            ?.filter(interaction => interaction.contract === interaction.contract)
            ?.map(interaction => interaction.interaction ?? '') ?? [],
        blockchain: interaction.blockchain,
      })) ?? []
    const walletInteractionPromises = walletInteraction.map(verifyContractFunction)
    promises.push(...walletInteractionPromises)

    await Promise.all(promises)

    const createAndUpdateData = {
      name: input.name,
      description: input.description,
      blockchain: input.blockchain,
      type: input.perkType,
      projectId: project.id,
      userId: user.id,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate,
      featuredImageUrl: input.featuredImageUrl,
      allowList: {
        spots: input.spot,
        spotsUsed: 0,
        priceSymbol: input.priceSymbol,
        totalSupply: input.totalSupply,
        price: input.price,
      },
      tokenHolderRequirement: input.tokenHolderRequirement === undefined ? null : input.tokenHolderRequirement,
      twitterRequirement: input.twitterRequirement === undefined ? [] : input.twitterRequirement,
      walletInteraction: input.walletInteraction === undefined ? [] : input.walletInteraction,
    }

    const dataForAws = {
      name: input.name,
      description: input.description,
      featureImage: input.featuredImageUrl,
      contractAddress: '',
      activeDate: input.startDate.toISOString(),
      expireDate: input.endDate.toISOString(),
      chain: input.blockchain,
      status: 'active',
      linkToClaim: '',
      requirement: {
        tokenHolder: input.tokenHolderRequirement,
        twitterRequirement: input.twitterRequirement,
      },
    }

    if (input.perkId) {
      const perk = await prisma.perk.findFirstOrThrow({
        where: {
          id: input.perkId,
          userId: user.id,
        },
      })
      /** Published Perk can only update the following field*/
      const isPublishedPerk = perk.status === PerkStatus.Published
      const publishedUpdateData = {
        description: input.description,
        startDate: input.startDate,
        endDate: input.endDate,
      }
      await prisma.perk.update({
        where: {
          id: input.perkId,
        },
        data: isPublishedPerk ? publishedUpdateData : createAndUpdateData,
      })
      if (isPublishedPerk) {
        await createPerkOnAWSService({
          ...dataForAws,
          id: input.perkId,
        })
      }

      return {
        message: 'Perk Updated',
      }
    } else {
      const result = await prisma.perk.create({
        data: createAndUpdateData,
      })

      await createPerkOnAWSService({
        ...dataForAws,
        id: result.id,
      })

      return {
        message: 'Perk Published',
      }
    }
  }),
  downloadAllowList: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const { user } = ctx.session
    /** Make sure user owns this perk*/
    await prisma.perk.findFirstOrThrow({
      where: {
        id: input,
        userId: user.id,
      },
    })
    return await prisma.claimed.findMany({
      where: {
        perkId: input,
      },
      select: {
        walletAddress: true,
        twitterName: true,
      },
    })
  }),
  createGenericPerk: protectedProcedure.input(createGenericPerkSchema).mutation(async ({ input, ctx }) => {
    const { user } = ctx.session
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    })

    /**user must have Twitter account to create perk*/
    await prisma.account.findFirstOrThrow({
      where: {
        userId: user.id,
        provider: 'twitter',
      },
    })

    const promises: Promise<unknown>[] = []
    /**Check token requirement contract validity*/
    const tokenRequirements = input.tokenHolderRequirement?.tokenRequirement ?? []
    const contractPromises = tokenRequirements.map(tokenRequirement => {
      const network = convertTokenRequirementNetworkToAlchemyNetwork(tokenRequirement.blockchain)
      if (tokenRequirement.tokenType === 'Token') {
        return getTokenMetadata(network, tokenRequirement.contractAddress)
      } else if (tokenRequirement.tokenType === 'NFT') {
        return getNftContractMetadata(network, tokenRequirement.contractAddress)
      }
      return Promise.resolve()
    })
    promises.push(...contractPromises)
    /** Check wallet interaction contract and interaction validity*/
    const walletInteraction =
      input.walletInteraction?.map(interaction => ({
        contractAddress: interaction.contract,
        functionNames:
          input.walletInteraction
            ?.filter(interaction => interaction.contract === interaction.contract)
            ?.map(interaction => interaction.interaction ?? '') ?? [],
        blockchain: interaction.blockchain,
      })) ?? []
    const walletInteractionPromises = walletInteraction.map(verifyContractFunction)
    promises.push(...walletInteractionPromises)

    await Promise.all(promises)

    const createAndUpdateData = {
      name: input.name,
      description: input.description,
      blockchain: input.blockchain,
      type: input.perkType,
      projectId: project.id,
      userId: user.id,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate,
      featuredImageUrl: input.featuredImageUrl,
      generic: {
        link: input.linkToClaim,
        type: input.genericPerkType,
      },
      tokenHolderRequirement: input.tokenHolderRequirement === undefined ? null : input.tokenHolderRequirement,
      twitterRequirement: input.twitterRequirement === undefined ? [] : input.twitterRequirement,
      walletInteraction: input.walletInteraction === undefined ? [] : input.walletInteraction,
    }

    const dataForAws = {
      name: input.name,
      description: input.description,
      featureImage: input.featuredImageUrl,
      contractAddress: '',
      activeDate: input.startDate.toISOString(),
      expireDate: input.endDate.toISOString(),
      chain: input.blockchain,
      status: 'active',
      linkToClaim: input.linkToClaim,
      requirement: {
        tokenHolder: input.tokenHolderRequirement,
        twitterRequirement: input.twitterRequirement,
      },
    }

    if (input.perkId) {
      const perk = await prisma.perk.findFirstOrThrow({
        where: {
          id: input.perkId,
          userId: user.id,
        },
      })
      /** Published Perk can only update the following field*/
      const isPublishedPerk = perk.status === PerkStatus.Published
      const publishedUpdateData = {
        description: input.description,
        startDate: input.startDate,
        endDate: input.endDate,
      }
      await prisma.perk.update({
        where: {
          id: input.perkId,
        },
        data: isPublishedPerk ? publishedUpdateData : createAndUpdateData,
      })
      if (isPublishedPerk) {
        await createPerkOnAWSService({
          ...dataForAws,
          id: input.perkId,
        })
      }

      return {
        message: 'Perk Updated',
      }
    } else {
      const result = await prisma.perk.create({
        data: createAndUpdateData,
      })

      await createPerkOnAWSService({
        ...dataForAws,
        id: result.id,
      })

      return {
        message: 'Perk Published',
      }
    }
  }),
})
