import { createTRPCRouter } from '@/server/api/trpc'
import { authRouter } from '@/server/api/routers/auth'
import { projectRouter } from '@/server/api/routers/project'
import { uploadRouter } from '@/server/api/routers/upload'
import { adminRouter } from '@/server/api/routers/admin'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  project: projectRouter,
  upload: uploadRouter,
  admin: adminRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
