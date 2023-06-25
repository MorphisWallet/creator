import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import { prisma } from '@/server/db'

export const projectRouter = createTRPCRouter({
  updateProject: protectedProcedure
    .input(
      z.object({
        name: z.string().max(50),
        description: z.string().max(500),
        link: z.string().url().max(255),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.session
      const updateOrCreateData = {
        name: input.name,
        description: input.description,
        link: input.link,
        userId: user.id,
      }
      await prisma.project.upsert({
        where: {
          userId: user.id,
        },
        update: updateOrCreateData,
        create: updateOrCreateData,
      })
      return {
        message: 'Project Info Updated',
      }
    }),
  getProjectDetail: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    return await prisma.project.findUniqueOrThrow({
      where: {
        userId,
      },
      select: {
        name: true,
        description: true,
        link: true,
      },
    })
  }),
})
