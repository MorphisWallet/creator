import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import { prisma } from '@/server/db'
import { projectCreateOrUpdateSchema } from '@/schemas/project'
import { z } from 'zod'

export const projectRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session

    const projects = await prisma.project.findMany({
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
      projects,
    }
  }),
  createOrUpdate: protectedProcedure.input(projectCreateOrUpdateSchema).mutation(async ({ input, ctx }) => {
    const { user } = ctx.session
    if (!user.twitter.username) {
      throw new Error('User must have verified Twitter account to create project')
    }

    if (input.id) {
      const project = await prisma.project.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: user.id,
        },
      })
      const updateData = {
        ...input,
      }
      delete updateData.id
      if (project.status === 'Published') {
        await prisma.project.update({
          where: {
            id: input.id,
            userId: user.id,
          },
          data: {
            description: input.description,
            projectStage: input.projectStage,
            previewImages: input.previewImages,
            bannerImage: input.bannerImage,
          },
        })
      } else {
        await prisma.project.update({
          where: {
            id: input.id,
            userId: user.id,
          },
          data: {
            ...updateData,
          },
        })
      }
      return {
        message: 'Project Updated',
      }
    }

    await prisma.project.create({
      data: {
        ...input,
        userId: user.id,
      },
    })

    return {
      message: 'Project Created',
    }
  }),
  deleteById: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    const { user } = ctx.session
    await prisma.project.delete({
      where: {
        id: input,
        userId: user.id,
      },
    })

    return {
      message: 'Project Deleted',
    }
  }),
})
