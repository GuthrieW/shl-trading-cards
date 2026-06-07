import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'
import { ApiResponse, SiteGroupedUniqueCards, SiteUniqueCards } from '..'
import { cardsQuery } from '@pages/api/database/database'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods = [GET]

const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SiteGroupedUniqueCards[] | null>>
) => {
  await middleware(req, res, cors)

  if (req.method !== GET) {
    return methodNotAllowed(req, res, allowedMethods)
  }

  const card_rarity = req.query.card_rarity as string | undefined

  const query = SQL`
    SELECT card_rarity, sub_type, total_count
    FROM unique_cards_2
  `

  if (card_rarity) {
    query.append(SQL` WHERE card_rarity = ${card_rarity}`)
  }

  const rows = await cardsQuery<SiteUniqueCards>(query)

  if ('error' in rows) {
    console.error(rows.error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .end('Database connection failed')
  }

  if (!rows.length) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'error',
      message: 'No unique cards found',
    })
  }
  const map = new Map<string, SiteGroupedUniqueCards>()

  for (const row of rows) {
    const rarity = row.card_rarity
    const isBase =
      !row.sub_type || row.sub_type === '' || row.sub_type === 'null'

    if (!map.has(rarity)) {
      map.set(rarity, {
        card_rarity: rarity,
        total_count: 0,
        subTypes: [],
      })
    }

    const entry = map.get(rarity)!

    if (isBase) {
      entry.total_count = row.total_count
    } else {
      entry.subTypes.push({
        sub_type: row.sub_type,
        total_count: row.total_count,
      })
    }
  }

  return res.status(StatusCodes.OK).json({
    status: 'success',
    payload: Array.from(map.values()),
  })
}

export default rateLimit(handler)
