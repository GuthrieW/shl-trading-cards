import { GET } from '@constants/http-methods'
import { NextApiRequest, NextApiResponse } from 'next'
import methodNotAllowed from '../lib/methodNotAllowed'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import { checkUserAuthorization } from '../lib/checkUserAuthorization'
import { usersQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { ApiResponse } from '..'
import { rateLimit } from 'lib/rateLimit'

const DEFAULT_SHL_URL: string = 'https://simulationhockey.com/' as const
const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

export type UserData = {
  uid: number
  username: string
  avatar: string
}

export type UserDataWithAvatarType = UserData & {
  avatartype: 'remote' | 'upload' | '0' | ''
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserData>>
) => {
  await middleware(req, res, cors)

  if (req.method === GET) {
    if (!(await checkUserAuthorization(req))) {
      res.status(StatusCodes.UNAUTHORIZED).end('Not authorized')
      return
    }

    const queryResult = await usersQuery<UserDataWithAvatarType>(SQL`
      SELECT uid, username, avatar, avatartype  
      FROM mybb_users
      WHERE uid=${req.cookies.userid}
    `)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Datebase connection failed')
      return
    }

    if (queryResult.length > 1) {
      console.error('Multiple users with same uid')
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Multiple users with same uid')
      return
    }

    if (queryResult.length === 0) {
      console.error('User permissions not found')
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('User permissions not found')
      return
    }

    const [user] = queryResult

    const userAvatar: string =
      user.avatartype === 'remote'
        ? `${DEFAULT_SHL_URL}${user.avatar.substring(2)}`
        : user.avatartype !== '' && user.avatar !== 'noavatar'
          ? user.avatar
          : `${DEFAULT_SHL_URL}images/default_avatar.png`

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: {
        uid: user.uid,
        username: user.username,
        avatar: userAvatar,
      },
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}

export default rateLimit(handler)
