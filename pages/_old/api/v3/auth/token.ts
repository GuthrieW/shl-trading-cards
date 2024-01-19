import * as jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '@pages/_old/api/v3/lib/middleware'
import { POST } from '@constants/http-methods'
import { queryPortal } from '@pages/_old/api/v3/lib/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import {
  convertRefreshTokenExpirationDate,
  getRefreshTokenExpirationDate,
} from '@pages/_old/api/v3/lib/token'
import { v4 as uuid } from 'uuid'

export type TokenData = {
  status: 'success' | 'logout'
  errorMessage?: string
  payload?: {
    userid: number
    accessToken: string
    refreshToken: string
  }
}

type InternalUserToken = {
  uid: number
  invalid: 0 | 1
  expires_at: string
}

const ALLOWED_METHODS = [POST]

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<TokenData>
) {
  if (!middleware(request, response, { allowedMethods: ALLOWED_METHODS })) {
    return
  }

  const result = await queryPortal<InternalUserToken>(SQL`
    SELECT uid, invalid, expires_at
    FROM refreshTokens
    WHERE token = ${request.body.refreshToken}
  `)

  if ('error' in result) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .end('Server connection failed')
    return
  }

  if (result.length === 0) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .end('No Refresh Token found')
    return
  }

  const [user] = result

  if (
    convertRefreshTokenExpirationDate(user.expires_at) < Date.now() ||
    user.invalid
  ) {
    response.status(StatusCodes.OK).json({
      status: 'logout',
      errorMessage: 'Refresh token expired',
    })
    return
  }

  const accessToken = jwt.sign({ userid: user.uid }, process.env.SECRET ?? '', {
    expiresIn: '15m',
  })

  const refreshToken = uuid()
  const expiresAt = getRefreshTokenExpirationDate()

  await queryPortal(SQL`
    INSERT INTO refreshTokens (uid, expires_at, token)
    VALUES (${user.uid}, ${expiresAt}, ${refreshToken})
    ON DUPLICATE KEY UPDATE token=${refreshToken}, expires_at=${expiresAt}
  `)

  response.status(StatusCodes.OK).json({
    status: 'success',
    payload: {
      userid: user.uid,
      accessToken,
      refreshToken,
    },
  })
}
