/**
 * @see https://github.com/Jackett/Jackett/wiki/Definition-format
 */

import { PrismaClient, Item } from '@prisma/client'
import Fastify from 'fastify'
import { consola } from 'consola'

const fastify = Fastify({
  logger: false
})

const prisma = new PrismaClient()

fastify.get<{
  Querystring: {
    query_term?: string
    limit?: string
  }
}>('/api/torrents', async (request, reply) => {
  const res = await Promise.all([
    // try original query_term
    prisma.item.findMany({
      where: {
        title: {
          // TODO: fuzzy search ?
          contains: request.query.query_term,
        }
      },
      // TODO: set a limit ?
      // take: 1000
    }),

    // try query_term by replacing spaces with dots
    prisma.item.findMany({
      where: {
        title: {
          contains: request.query.query_term?.replace(/\s/g, '.'),
        }
      }
    })
  ])

  // merge all results
  const items = ([] as Item[]).concat(
    ...res
  )

  const categoryMap = {
    tv: {
      id: 1
    },
    movies: {
      id: 0
    },
    ebooks: {
      id: 3
    },
    games_pc_iso: {
      id: 2
    }
  }

  reply.send({
    data: items
    // exclude items of unknown categories
    // see rarbg_custom.yml for supported categories
    .filter(item => item.cat in categoryMap)
    .map(item => ({
      id: item.id,
      cat: categoryMap[item.cat as keyof typeof categoryMap].id,
      title: item.title,
      hash: item.hash,
      imdbId: item.imdb,
      addedOn: item.dt,
      // Convert BigInt to Number
      size: item.size ? Number(item.size) : null
    }))
  })
})

fastify.listen({
  port: process.env.PORT ? Number.parseInt(process.env.PORT) : 9093,
  host: '0.0.0.0'
}, (err, address) => {
  if (err) {
    consola.error(err)
    process.exit(1)
  }

  consola.success(`Server is now listening on ${address}`)
})