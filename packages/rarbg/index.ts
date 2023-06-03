import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function start() {
  const items = await prisma.items.findMany({
    take: 3
  })

  console.log(items)
}

start()