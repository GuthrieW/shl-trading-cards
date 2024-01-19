import { POST } from '@constants/http-methods'
import middleware from '@pages/_old/api/v3/lib/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import { queryPortal } from '@pages/_old/api/v3/lib/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import { MD5 } from 'crypto-js'
import * as jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import { getRefreshTokenExpirationDate } from '@pages/_old/api/v3/lib/token'

type InternalLoginUser = {
  uid: number
  usergroup: number
  username: string
  password: string
  salt: string
}

export type LoginData = {
  status: 'success' | 'error'
  errorMessage?: string
  payload?: {
    userid: number
    usergroup: number
    accessToken: string
    refreshToken: string
  }
}

const ALLOWED_METHODS = [POST]

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LoginData>
) {
  if (!middleware(request, response, { allowedMethods: ALLOWED_METHODS })) {
    return
  }

  const result = await queryPortal<InternalLoginUser>(SQL`
    SELECT uid, username, password,salt, usergroup
    FROM mybb_users
    WHERE username = ${request.body.username}
  `)

  if ('error' in result) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .end('Server connection failed')
    return
  }

  if (result.length > 1) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .end('Multiple users with the same username')
    return
  }

  if (result.length === 0) {
    response.status(StatusCodes.OK).json({
      status: 'error',
      errorMessage: 'Invalid username or password',
    })
    return
  }

  const [user] = result

  if (user.usergroup === 7) {
    response.status(200).json({
      status: 'error',
      errorMessage: 'You have been banned. You cannot login.',
    })
    return
  }

  if (user.usergroup === 5) {
    response.status(200).json({
      status: 'error',
      errorMessage:
        'Your account is still awaiting activation. Please be sure to verify your account. Follow-up on the forum or on our Discord if you feel this is an error.',
    })
    return
  }

  const saltedPassword = MD5(
    MD5(user.salt).toString() + MD5(request.body.password).toString()
  ).toString()

  if (saltedPassword !== user.password) {
    response.status(200).json({
      status: 'error',
      errorMessage: 'Invalid username or password',
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
      usergroup: user.usergroup,
      accessToken,
      refreshToken,
    },
  })
}
