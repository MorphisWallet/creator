import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const addressList = ['0xBfa9f08Ef03DD4Bd31C719678E297d050E967761', '0x424E295c9Fa61F4667C38BCa31faAD0e27dA35c6']

async function main() {
  await prisma.adminWallet.createMany({
    data: addressList.map(address => ({ address })),
  })
  console.log('Admin wallets seeed')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
