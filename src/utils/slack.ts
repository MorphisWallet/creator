import { env } from '@/env.mjs'

type SendInReviewAlertMessageInput = {
  name: string
  projectId: string
  logoUrl: string
  description: string
}

export const sendInReviewAlertMessage = async (input: SendInReviewAlertMessageInput) => {
  const { name, projectId, logoUrl, description } = input
  const projectUrl = `${env.SIWE_URL}/project/${projectId}`
  const slackMessage = {
    text: 'A new project has been submitted for review',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'A new project is waiting for your review',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${projectUrl}|${name}> \n ${description}`,
        },
        accessory: {
          type: 'image',
          image_url: logoUrl,
          alt_text: 'logo',
        },
      },
    ],
  }

  const slackUrl = env.KIOSK_SLACK_WEBHOOK
  await fetch(slackUrl, {
    method: 'POST',
    body: JSON.stringify(slackMessage),
  })
}
