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
  const limit = !request.query.query_term
    ? 100
    : undefined

  const movie_and_tv: (Item | null)[] = !request.query.query_term
    ? await Promise.all([
        prisma.item.findFirst({
          where: {
            cat: {
              equals: 'movies'
            }
          }
        }),

        prisma.item.findFirst({
          where: {
            cat: {
              equals: 'tv'
            }
          }
        })
      ])
    : []

  const res = await Promise.all([
    // try original query_term
    prisma.item.findMany({
      where: {
        title: {
          // TODO: fuzzy search ?
          contains: request.query.query_term ?? '',
        }
      },
      take: limit ?? 99999999999999
    }),

    // try query_term by replacing spaces with dots
    prisma.item.findMany({
      where: {
        title: {
          contains: request.query.query_term?.replace(/\s/g, '.') ?? '',
        }
      },
      take: limit ?? 99999999999999
    }),

    // When no query_term is provided we at least send a Movie and a TV result
    // for Sonarr and Radarr tests
    ...movie_and_tv as [Item, Item]
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

  function getCategoryMapKey(item: Item) {
    return Object
      .keys(categoryMap)
      .find(catName => item.cat && item.cat.startsWith(catName)) as (keyof typeof categoryMap) | undefined
  }

  reply.send({
    data: items
    // exclude items of unknown categories
    // see rarbg_custom.yml for supported categories
    .filter(item => getCategoryMapKey(item))
    .map(item => ({
      id: item.id,
      cat: categoryMap[ getCategoryMapKey(item)!  ].id,
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