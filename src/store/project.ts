import { ProjectStatus, ProjectStage } from '@prisma/client'
import { type ProjectCreateOrUpdateSchemaType } from '@/schemas'
import { create } from 'zustand'

type UpdateField = <K extends keyof ProjectCreateOrUpdateSchemaType>(field: K, value: ProjectCreateOrUpdateSchemaType[K]) => void

type Store = ProjectCreateOrUpdateSchemaType & {
  updateField: UpdateField
  reset: () => void
}

const initialState: ProjectCreateOrUpdateSchemaType = {
  id: undefined,
  blockchains: [],
  categories: [],
  name: '',
  logoUrl: '',
  description: '',
  slug: '',
  website: undefined,
  twitter: undefined,
  discord: undefined,
  bannerImage: '',
  previewImages: [],
  projectStage: ProjectStage.Mainnet,
  status: ProjectStatus.InReview,
}

export const useProjectFormStore = create<Store>(set => ({
  ...initialState,
  updateField: (field, value) => set(state => ({ ...state, [field]: value })),
  reset: () => set(() => ({ ...initialState })),
}))
