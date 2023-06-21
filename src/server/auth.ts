import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { type GetServerSidePropsContext } from 'next'
import { type DefaultSession, getServerSession, type NextAuthOptions } from 'next-auth'
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
      address?: string
      // ...other properties
      // role: UserRole;
      twitter: {
        username: string
      }
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

type TwitterProfile = {
  data: {
    id: string
    name: string
    email: string | null
    profile_image_url: string
    username: string
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: (ctxReq: CtxOrReq) => NextAuthOptions = ({ req }) => ({
  callbacks: {
    session: async ({ session, user, token }) => {
      const id = token?.sub ?? user.id
      const twitterUserName = await prisma.user.findFirst({
        where: {
          id,
        },
        select: {
          twitter: {
            select: {
              username: true,
            },
          },
        },
      })

      return {
        ...session,
        user: {
          ...session.user,
          id,
          twitter: {
            username: twitterUserName?.twitter?.username ?? '',
          },
        },
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider<TwitterProfile>({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: '2.0',
      profile({ data }) {
        return {
          id: data.id,
          name: data.name,
          email: null,
          image: data.profile_image_url,
          twitter: {
            id: data.id,
            name: data.name,
            username: data.username,
            image: data.profile_image_url,
          },
        }
      },
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
        const nextAuthUrl = new URL(env.SIWE_URL)

        const result = await siwe.verify({
          signature: credentials?.signature || '',
          domain: nextAuthUrl.host,
          nonce: await getCsrfToken({ req: { headers: req?.headers } }),
        })

        if (!result.success) {
          throw new Error('Verification Failed')
        }

        // Check if wallet address exist, if yes return user id associated with the wallet
        const walletAddress = result.data.address
        const existingAccount = await prisma.account.findFirst({
          where: {
            providerAccountId: walletAddress,
          },
          select: {
            userId: true,
            providerAccountId: true,
            user: {
              select: {
                image: true,
                name: true,
              },
            },
          },
        })
        if (existingAccount) {
          return {
            id: existingAccount.userId,
            name: existingAccount.user.name,
            image: existingAccount.user.image,
          }
        }

        // Create new user and account if wallet doesn't exist in account collection
        const user = await prisma.user.create({
          data: {
            address: walletAddress,
            name: walletAddress,
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

        return {
          id: user.id,
          name: user.address,
        }
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
    maxAge: 60 * 60 * 24 * 2, // 2 days
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
