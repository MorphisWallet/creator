import { adminProcedure, createTRPCRouter } from '@/server/api/trpc'
import { z } from 'zod'
import { prisma } from '@/server/db'
import { ProjectStatus } from '@prisma/client'

export const adminRouter = createTRPCRouter({
  listProjects: adminProcedure
    .input(
      z.object({
        skip: z.number().default(0).optional(),
        take: z.number().default(10).optional(),
        status: z.array(z.nativeEnum(ProjectStatus)),
      })
    )
    .query(async ({ input }) => {
      const count = await prisma.project.count({})
      const projects = await prisma.project.findMany({
        where: {
          status: {
            in: input.status,
          },
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        skip: input?.skip,
        take: input?.take,
      })

      return {
        projects,
        count,
      }
    }),
  rejectProjectById: adminProcedure
    .input(
      z.object({
        id: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.project.update({
        where: {
          id: input.id,
        },
        data: {
          rejectedReason: input.reason,
          status: 'Rejected',
        },
      })
      return {
        message: 'Success',
      }
    }),
  approveProjectById: adminProcedure.input(z.string()).mutation(async ({ input }) => {
    await prisma.project.updateMany({
      where: {
        id: input,
      },
      data: {
        status: ProjectStatus.Published,
      },
    })
    return {
      message: 'Success',
    }
  }),
  setProjectFeatureStatusById: adminProcedure
    .input(
      z.object({
        id: z.string(),
        isFeatured: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.project.updateMany({
        where: {
          id: input.id,
        },
        data: {
          isFeatured: input.isFeatured,
        },
      })
      return {
        message: 'Success',
      }
    }),
  deleteProjectById: adminProcedure.input(z.string()).mutation(async ({ input }) => {
    await prisma.project.delete({
      where: {
        id: input,
      },
    })

    return {
      message: 'Project Deleted',
    }
  }),
})
