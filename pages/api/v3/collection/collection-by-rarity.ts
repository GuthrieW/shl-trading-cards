import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import SQL, { SQLStatement } from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'
import { ApiResponse, UserCollection, UserUniqueCollection } from '..'
import { cardsQuery } from '@pages/api/database/database'
import { rateLimit } from 'lib/rateLimit'

const allowedMethods: string[] = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<InternalUserUniqueCollection[] | null>>
) => {
  await middleware(req, res, cors)
  const card_rarity = req.query.card_rarity as string
  const userID = req.query.userID as string
  const sub_type = req.query.sub_type as string
  const base_sets = req.query.base_sets as string
  if (req.method === GET) {
    const queryString: SQLStatement = SQL`
      SELECT 
    uc.userID,
    ui.username,
    uc.card_rarity,
    uc.sub_type,
    uc.owned_count,
    uc.rarity_rank
FROM
    user_collections uc JOIN user_info ui ON uc.userID = ui.uid WHERE 1 `
    if (card_rarity) {
      queryString.append(SQL` and uc.card_rarity = ${card_rarity}`)
    }
    if (userID) {
      queryString.append(SQL` AND uc.userID = ${userID}`)
    }
    if (sub_type) {
      queryString.append(SQL` AND uc.sub_type = ${sub_type}`)
    }
    if (base_sets) {
      queryString.append(SQL` and sub_type = '' `)
    }
    queryString.append(SQL`order by uc.owned_count DESC`)

    const queryResult = await cardsQuery<UserUniqueCollection>(queryString)
    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed')
      return
    }

    if (queryResult.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: 'error', message: 'Something happened' })
      return
    }

    const grouped = new Map<string, UserCollection>()

    for (const row of queryResult) {
      const key = `${row.userID}:${row.card_rarity}`

      if (!grouped.has(key)) {
        grouped.set(key, {
          card_rarity: row.card_rarity,
          userID: row.userID,
          username: row.username,
          owned_count: 0,
          rarity_rank: 0,
          subTypes: [],
        })
      }

      const entry = grouped.get(key)!
      const isBase =
        !row.sub_type || row.sub_type === '' || row.sub_type === 'null'

      if (isBase) {
        entry.owned_count = row.owned_count
        entry.rarity_rank = row.rarity_rank
      } else {
        entry.subTypes.push({
          sub_type: row.sub_type,
          owned_count: row.owned_count,
          rarity_rank: row.rarity_rank,
        })
      }
    }

    const result = Array.from(grouped.values()).sort(
      (a, b) => b.owned_count - a.owned_count
    )

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: Array.from(result.values()),
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
export default rateLimit(handler)
