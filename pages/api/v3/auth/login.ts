import { MD5 } from 'crypto-js'
import { POST } from '@constants/http-methods'
import { NextApiRequest, NextApiResponse } from 'next'
import methodNotAllowed from '../lib/methodNotAllowed'
import SQL from 'sql-template-strings'
import { queryDatabase } from '@pages/api/database/database'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import { getRefreshTokenExpirationDate } from './utils'

const allowedMethods: string[] = [POST]

type InternalLoginUser = {
  uid: number
  usergroup: number
  username: string
  password: string
  salt: string
}

export default async function loginEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === POST) {
    const queryResult = await queryDatabase<InternalLoginUser>(SQL`
      SELECT uid, username, password, salt, usergroup
      FROM mybb_users
      WHERE username = ${req.body.username}
    `)

    if ('error' in queryResult) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    if (queryResult.length > 1) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Multiple users with same username')
      return
    }

    if (queryResult.length === 0) {
      res.status(StatusCodes.OK).json({
        status: 'error',
        message: 'Invalid username or password',
      })
      return
    }

    const [user] = queryResult

    if (user.usergroup === 7) {
      res.status(StatusCodes.OK).json({
        status: 'error',
        message: 'You have been banned. You cannot login.',
      })
      return
    }

    if (user.usergroup === 5) {
      res.status(StatusCodes.OK).json({
        status: 'error',
        errorMessage:
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

    const accessToken = jwt.sign(
      { userid: user.uid },
      process.env.SECRET ?? '',
      {
        expiresIn: '15m',
      }
    )

    const refreshToken = uuid()
    const expiresAt = getRefreshTokenExpirationDate()

    await queryDatabase(SQL`
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
  }

  methodNotAllowed(req, res, allowedMethods)
}
