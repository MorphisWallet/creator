import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { env } from '@/env.mjs'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

export const uploadRouter = createTRPCRouter({
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        extension: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const client = new S3Client({
        credentials: {
          accessKeyId: env.S3_UPLOAD_KEY,
          secretAccessKey: env.S3_UPLOAD_SECRET,
        },
        region: env.S3_UPLOAD_REGION,
      })
      const key = `creator/${uuidv4()}.${input.extension}`
      const command = new PutObjectCommand({
        Bucket: env.S3_UPLOAD_BUCKET,
        Key: key,
      })

      const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 * 5 })
      const imageUrl = `https://${env.S3_UPLOAD_BUCKET}.s3-${env.S3_UPLOAD_REGION}.amazonaws.com/${key}`
      return {
        uploadUrl,
        imageUrl,
      }
    }),
})
