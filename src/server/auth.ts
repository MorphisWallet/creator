import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { type GetServerSidePropsContext } from 'next'
import { getServerSession, type NextAuthOptions, type DefaultSession } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'
import { env } from '@/env.mjs'
import { prisma } from '@/server/db'
import { SiweMessage } from 'siwe'
import { getCsrfToken } from 'next-auth/react'
import { type CtxOrReq } from 'next-auth/client/_utils'
import { z } from 'zod'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: (ctxReq: CtxOrReq) => NextAuthOptions = ({ req }) => ({
  callbacks: {
    session: ({ session, user, token }) => {
      const id = token?.sub ?? user.id
      return {
        ...session,
        user: {
          ...session.user,
          id,
        },
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: '2.0',
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      authorize: async credentials => {
        const siweSchema = z.object({
          domain: z.string(),
          statement: z.string(),
          uri: z.string(),
          version: z.string(),
          address: z.string(),
          chainId: z.number(),
          nonce: z.string(),
          issuedAt: z.string(),
        })
        const siweValidationResult = siweSchema.parse(JSON.parse(credentials?.message || '{}'))
        const siwe = new SiweMessage(siweValidationResult)
        const nextAuthUrl = new URL(env.NEXTAUTH_URL)

        const result = await siwe.verify({
          signature: credentials?.signature || '',
          domain: nextAuthUrl.host,
          nonce: await getCsrfToken({ req: { headers: req?.headers } }),
        })

        // Check if user exists
        const walletAddress = result.data.address
        let user = await prisma.user.findUnique({
          where: {
            address: walletAddress,
          },
        })

        // Create new user if user doesn't exist
        if (!user) {
          user = await prisma.user.create({
            data: {
              address: walletAddress,
            },
          })
          await prisma.account.create({
            data: {
              userId: user.id,
              type: 'credentials',
              provider: 'Ethereum',
              providerAccountId: walletAddress,
            },
          })
        }

        if (result.success) {
          return {
            id: user.id,
          }
        }
        return null
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: 'jwt',
  },
  secret: env.NEXTAUTH_SECRET,
})

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext['req']; res: GetServerSidePropsContext['res'] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions(ctx))
}
