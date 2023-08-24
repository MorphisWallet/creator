import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import { prisma } from '@/server/db'
import { projectCreateOrUpdateSchema } from '@/schemas/project'
import { z } from 'zod'
import { type Prisma, type Project } from '@prisma/client'
import { sendInReviewAlertMessage } from '@/utils/slack'
import { env } from '@/env.mjs'

const MAX_PROJECTS_FOR_USER = 10

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
    const isAdmin = user.role === 'Admin'

    const userProjects = await prisma.project.count({
      where: {
        userId: user.id,
      },
    })

    if (userProjects >= MAX_PROJECTS_FOR_USER && !isAdmin) {
      throw new Error('User has reached max number of projects')
    }

    if (input.id) {
      const filter: Prisma.ProjectWhereUniqueInput = {
        id: input.id,
      }
      if (!isAdmin) {
        filter.userId = user.id
      }
      const project = await prisma.project.findUniqueOrThrow({
        where: filter,
      })
      const updateData = {
        ...input,
      }
      delete updateData.id
      let projectData: Project
      if (!isAdmin) {
        const shouldLimitEdit = project.status === 'Published' && input.status === 'Published'
        if (shouldLimitEdit) {
          projectData = await prisma.project.update({
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
          projectData = await prisma.project.update({
            where: {
              id: input.id,
              userId: user.id,
            },
            data: {
              ...updateData,
            },
          })
        }
      } else {
        projectData = await prisma.project.update({
          where: {
            id: input.id,
          },
          data: {
            ...updateData,
          },
        })
      }
      return {
        project: projectData,
      }
    }

    if (!isAdmin && input.status === 'Published') {
      throw new Error('Only admins can publish projects')
    }

    const slugExists = await prisma.project.findUnique({
      where: {
        slug: input.slug,
      },
    })

    if (slugExists) {
      throw new Error('Slug already exists')
    }

    const createdProject = await prisma.project.create({
      data: {
        ...input,
        userId: user.id,
      },
    })

    if (createdProject.status === 'InReview' && env.NODE_ENV === 'production') {
      await sendInReviewAlertMessage({
        projectId: createdProject.id,
        description: createdProject.description,
        name: createdProject.name,
        logoUrl: createdProject.logoUrl,
      })
    }

    return {
      project: createdProject,
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
  getProjectById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { user } = ctx.session
      const filter: Prisma.ProjectWhereUniqueInput = {
        id: input.id,
      }

      if (user.role !== 'Admin') {
        filter.userId = user.id
      }

      const project = await prisma.project.findUniqueOrThrow({
        where: filter,
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      })

      return {
        project,
      }
    }),
})
