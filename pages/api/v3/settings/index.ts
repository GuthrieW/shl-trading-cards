import { GET } from '@constants/http-methods'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

export type SettingsData = {
  uid: number
  username: string
  subscription: number
}

export default async function settingsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ settings: SettingsData[] }>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const limit: string = (req.query.limit ?? 10) as string
    const offset: string = (req.query.offset ?? 0) as string
    const sort: string = (req.query.sort ?? 'username:asc') as string

    const queryResult = await cardsQuery<SettingsData>(SQL`
        SELECT u.uid, u.username, s.subscription 
        FROM admin_cards.settings s
        LEFT JOIN admin_mybb.mybb_users u ON s.userID = u.uid
        WHERE s.subscription > 0
        LIMIT 10 OFFSET 0;
      `)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: { settings: queryResult },
    })
  }
}
