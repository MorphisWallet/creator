import { createTRPCRouter } from '@/server/api/trpc'
import { authRouter } from '@/server/api/routers/auth'
import { projectRouter } from '@/server/api/routers/project'
import { perkRouter } from '@/server/api/routers/perk'
import { uploadRouter } from '@/server/api/routers/upload'
import { blockchainRouter } from '@/server/api/routers/blockchain'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  project: projectRouter,
  perk: perkRouter,
  upload: uploadRouter,
  blockchain: blockchainRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
