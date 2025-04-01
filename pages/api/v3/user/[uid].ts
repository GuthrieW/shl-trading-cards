import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import { UserData, UserDataWithAvatarType } from '.'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET } from '@constants/http-methods'
import { usersQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'
import { rateLimit } from 'lib/rateLimit'

const DEFAULT_SHL_URL: string = 'https://simulationhockey.com/' as const
const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserData>>
) => {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const uid = req.query.uid as string
    const queryResult = await usersQuery<UserDataWithAvatarType>(SQL`
      SELECT uid, username, avatar, avatartype  
      FROM mybb_users
      WHERE uid=${uid}
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
