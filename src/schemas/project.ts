import { z } from 'zod'
import { ProjectStatus, ProjectStage, ProjectBlockchain, Category } from '@prisma/client'

export const projectCreateOrUpdateSchema = z.object({
  id: z.string().optional(),
  blockchains: z.array(z.nativeEnum(ProjectBlockchain)).min(1, {
    message: 'You must choose at least one blockchain',
  }),
  categories: z.array(z.nativeEnum(Category)).min(1, {
    message: 'You must choose at least one category',
  }),
  name: z.string().nonempty({ message: 'Project name cannot be empty' }),
  logoUrl: z.string().url({ message: 'Logo is required' }),
  slug: z.string().refine(
    value => {
      return /^[a-z0-9-]+$/.test(value)
    },
    {
      message: 'Slugs can only contain lowercase letters, numbers, or dashes.',
    }
  ),
  description: z.string().nonempty({ message: 'Description cannot be empty' }),
  website: z.string().url({ message: 'Website url is not valid' }).optional().or(z.literal('')),
  twitter: z.string().url({ message: 'Twitter url is not valid' }).optional().or(z.literal('')),
  discord: z.string().url({ message: 'Discord url is not valid' }).optional().or(z.literal('')),
  bannerImage: z.string().url({ message: 'Banner is required' }),
  previewImages: z.array(z.string().url()).min(0),
  projectStage: z.nativeEnum(ProjectStage),
  status: z.nativeEnum(ProjectStatus),
})

export type ProjectCreateOrUpdateSchemaType = z.infer<typeof projectCreateOrUpdateSchema>

export const categoryLabelMapping: Record<Category, string> = {
  [Category.DeFi]: 'DeFi',
  [Category.NFT]: 'NFT',
  [Category.Game]: 'Game',
  [Category.Infrastructure]: 'Infrastructure',
  [Category.Social]: 'Social',
  [Category.SmartNFT]: 'Smart NFT',
  [Category.Others]: 'Other',
  [Category.Bot]: 'Bot',
  [Category.Tooling]: 'Tooling',
  [Category.Dao]: 'Dao',
}
