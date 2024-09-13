import { GET } from '@constants/http-methods'
import { NextApiRequest, NextApiResponse } from 'next'
import methodNotAllowed from '../lib/methodNotAllowed'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import { checkUserAuthorization } from '../lib/checkUserAuthorization'
import { usersQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'

const DEFAULT_SHL_URL: string = 'https://simulationhockey.com/' as const
const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

type UserData = {
  uid: number
  username: string
  avatar: string
}

type UserDataWithAvatarType = UserData & {
  avatartype: 'remote' | 'upload' | '0' | ''
}

export default async function userEndpoint<UserData>(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    if (!(await checkUserAuthorization(req))) {
      res.status(StatusCodes.UNAUTHORIZED).end('Not authorized')
      return
    }

    const response = await usersQuery<UserDataWithAvatarType>(SQL`
      SELECT uid, username, avatar, avatartype  
      FROM mybb_users
      WHERE uid=${req.cookies.userid}
    `)

    if ('error' in response || response.length === 0) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    const [user] = response

    const userAvatar: string =
      user.avatartype === 'remote'
        ? `${DEFAULT_SHL_URL}${user.avatar.substring(2)}`
        : user.avatartype !== '' && user.avatar !== 'noavatar'
          ? user.avatar
          : `${DEFAULT_SHL_URL}images/default_avatar.png`

    res.status(StatusCodes.OK).json({
      uid: user.uid,
      username: user.username,
      avatar: userAvatar,
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
