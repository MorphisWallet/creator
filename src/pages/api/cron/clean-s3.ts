import type { NextApiRequest, NextApiResponse } from 'next'

import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { env } from '@/env.mjs'
import { prisma } from '@/server/db'
import dayjs from 'dayjs'

const client = new S3Client({
  credentials: {
    accessKeyId: env.S3_UPLOAD_KEY,
    secretAccessKey: env.S3_UPLOAD_SECRET,
  },
  region: env.S3_UPLOAD_REGION,
})

/**fetch all keys and return 7days old files*/
const fetchAllOldS3Objects = async () => {
  const command = new ListObjectsV2Command({
    Bucket: env.S3_UPLOAD_BUCKET,
    MaxKeys: 500,
  })
  const result: string[] = []
  let isTruncated: boolean | undefined = true
  while (isTruncated) {
    const { Contents, IsTruncated, NextContinuationToken } = await client.send(command)
    isTruncated = IsTruncated
    command.input.ContinuationToken = NextContinuationToken
    const sevenDaysAgo = dayjs().subtract(7, 'day')
    for (const content of Contents ?? []) {
      if (dayjs(content.LastModified).isBefore(sevenDaysAgo)) {
        result.push(content.Key ?? '')
      }
    }
  }

  return result.filter(key => key !== '')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allProjectImagesPromise = prisma.project.findMany({
      select: {
        logoUrl: true,
        previewImages: true,
        bannerImage: true,
      },
    })

    const [allProjectImages, oldS3ImageKeys] = await Promise.all([allProjectImagesPromise, fetchAllOldS3Objects()])

    const existingImages = allProjectImages
      .map(project => {
        return [project.logoUrl, project.bannerImage, ...project.previewImages]
      })
      .flat()

    const keysToDelete = oldS3ImageKeys.filter(key => !existingImages.some(image => image.includes(key)))

    if (keysToDelete.length === 0) {
      return res.status(200).json({ message: 'No old images found' })
    }

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: env.S3_UPLOAD_BUCKET,
      Delete: {
        Objects: keysToDelete.map(key => ({ Key: key })),
      },
    })
    await client.send(deleteCommand)

    res.status(200).json({ deletedKeys: keysToDelete })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
