import { MD5 } from 'crypto-js'
import { POST } from '@constants/http-methods'
import { NextApiRequest, NextApiResponse } from 'next'
import methodNotAllowed from '../lib/methodNotAllowed'
import SQL from 'sql-template-strings'
import { portalQuery, usersQuery } from '@pages/api/database/database'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuid } from 'uuid'
import { ApiResponse } from '..'
import Cors from 'cors'
import middleware from '@pages/api/database/middleware'
import { getRefreshTokenExpirationDate, signJwt } from './lib'

const allowedMethods: string[] = [POST]
const cors = Cors({
  methods: allowedMethods,
})

type LoginData = {
  userid: number
  usergroup: number
  accessToken: string
  refreshToken: string
}

type InternalLoginUser = {
  uid: number
  usergroup: number
  username: string
  password: string
  salt: string
}

export default async function loginEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LoginData>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === POST) {
    const queryResult: { error: unknown } | InternalLoginUser[] =
      await usersQuery<InternalLoginUser>(SQL`
      SELECT uid, username, password, salt, usergroup, displaygroup, additionalgroups
      FROM mybb_users
      WHERE username = ${req.body.username}
    `)

    if ('error' in queryResult) {
      console.error('Server connection failed')
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    if (queryResult.length > 1) {
      console.error('Multiple users with same username')
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Multiple users with same username')
      return
    }

    if (queryResult.length === 0) {
      console.error('Multiple users with same username')
      res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'Invalid username or password',
      })
      return
    }

    const [user] = queryResult

    if (user.usergroup === 7) {
      console.log(`User with username ${req.body.username} is banned`)
      res.status(StatusCodes.OK).json({
        status: 'error',
        message: 'You have been banned. You cannot login.',
      })
      return
    }

    if (user.usergroup === 5) {
      res.status(StatusCodes.OK).json({
        status: 'error',
        message:
          'Your account is still awaiting activation. Please be sure to verify your account. Follow-up on the forum or on our Discord if you feel this is an error.',
      })
      return
    }

    const saltedPassword = MD5(
      MD5(user.salt).toString() + MD5(req.body.password).toString()
    ).toString()

    if (saltedPassword !== user.password) {
      res.status(StatusCodes.OK).json({
        status: 'error',
        message: 'Invalid username or password',
      })
      return
    }

    const accessToken: string = signJwt(user.uid)
    const refreshToken: string = uuid()
    const expiresAt: string = getRefreshTokenExpirationDate()

    await portalQuery(SQL`
      INSERT INTO refreshTokens (uid, expires_at, token)
      VALUES (${user.uid}, ${expiresAt}, ${refreshToken})
      ON DUPLICATE KEY UPDATE token=${refreshToken}, expires_at=${expiresAt};
    `)

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: {
        userid: user.uid,
        usergroup: user.usergroup,
        accessToken,
        refreshToken,
      },
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
