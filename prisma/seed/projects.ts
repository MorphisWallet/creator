import { PrismaClient, type Project, type Prisma, ProjectStage, ProjectStatus, ProjectBlockchain, Category } from '@prisma/client'

const prisma = new PrismaClient()
import { faker } from '@faker-js/faker'

const userId = '64c0cdee247e468191e1605d'
const projectToCreate = 100

function createRandomProject(): Prisma.ProjectCreateManyInput {
  return {
    name: faker.commerce.productName(),
    projectStage: faker.helpers.objectValue(ProjectStage),
    status: faker.helpers.objectValue(ProjectStatus),
    isFeatured: faker.datatype.boolean(),
    userId,
    bannerImage: faker.image.url(),
    logoUrl: faker.image.avatar(),
    blockchain: faker.helpers.objectValue(ProjectBlockchain),
    discord: faker.internet.url(),
    twitter: faker.internet.url(),
    website: faker.internet.url(),
    description: faker.lorem.paragraph(),
    categories: faker.helpers.arrayElements(Object.values(Category)),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    previewImages: faker.helpers.multiple(faker.image.url, { count: 4 }),
  }
}

async function main() {
  const data: Prisma.ProjectCreateManyInput[] = []
  for (let i = 0; i < projectToCreate; i++) {
    data.push(createRandomProject())
  }
  await prisma.project.createMany({
    data: data,
  })
  console.log('project seeded')
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
