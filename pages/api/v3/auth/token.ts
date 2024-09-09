import { POST } from '@constants/http-methods'
import methodNotAllowed from '../lib/methodNotAllowed'
import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import serverConnectionFailed from '../lib/serverConnectionFailed'
import {
  convertRefreshTokenExpirationDate,
  getRefreshTokenExpirationDate,
  signJwt,
} from './utils'
import { ApiResponse } from '..'
import { v4 as uuid } from 'uuid'

type TokenData = {
  userid: number
  accessToken: string
  refreshToken: string
}

type InternalUserToken = {
  uid: number
  invalid: 0 | 1
  expires_at: string
}

const allowedMethods: string[] = [POST]

export default async function tokenEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenData>>
) {
  if (req.method === POST) {
    const queryResult = await queryDatabase<InternalUserToken>(SQL`
      SELECT uid, invalid, expires_at
      FROM refreshTokens,
      WHERE token=${req.body.refreshToken};
    `)

    if (serverConnectionFailed(res, queryResult)) return

    if (queryResult.length === 0) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('No refresh token found')
      return
    }

    const [user] = queryResult

    if (
      convertRefreshTokenExpirationDate(user.expires_at) < Date.now() ||
      user.invalid
    ) {
      res.status(StatusCodes.OK).json({
        status: 'logout',
        message: 'Refresh token expired',
      })
    }
    const accessToken: string = signJwt(user.uid)
    const refreshToken: string = uuid()
    const expiresAt: string = getRefreshTokenExpirationDate()

    await queryDatabase(SQL`
      INSERT INTO refreshTokens (uid, expires_at, token)
      VALUES (${user.uid}, ${expiresAt}, ${refreshToken})
      ON DUPLICATE KEY UPDATE token=${refreshToken}, expires_at=${expiresAt};
    `)

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: {
        userid: user.uid,
        accessToken,
        refreshToken,
      },
    })
  }

  methodNotAllowed(req, res, allowedMethods)
}
