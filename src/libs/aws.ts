type CreatePerkInput = {
  contractAddress?: string
  chain: string
  id: string
  name: string
  description: string
  featureImage: string
  requirement: object
  linkToClaim: string
  status: string
  activeDate: string
  expireDate: string
}

export const createPerkOnAWSService = async (data: CreatePerkInput) => {
  const endpoint = 'https://3wp2iiwkt4.execute-api.ap-southeast-1.amazonaws.com/default/airdawg-user-services-dev-createAirdawgPerk'
  return fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
