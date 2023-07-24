import { z } from 'zod'
import { ProjectStatus, ProjectStage, ProjectBlockchain, Category } from '@prisma/client'

export const projectCreateOrUpdateSchema = z.object({
  id: z.string().optional(),
  blockchain: z.nativeEnum(ProjectBlockchain),
  categories: z.array(z.nativeEnum(Category)).min(1),
  name: z.string(),
  logoUrl: z.string(),
  description: z.string(),
  website: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  discord: z.string().url().optional().or(z.literal('')),
  bannerImage: z.string().url(),
  previewImages: z.array(z.string().url()).min(1),
  projectStage: z.nativeEnum(ProjectStage),
  status: z.nativeEnum(ProjectStatus),
})

export type ProjectCreateOrUpdateSchemaType = z.infer<typeof projectCreateOrUpdateSchema>
