import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import { GET } from '@constants/http-methods'
import Cors from 'cors'
import { checkUserAuthorization } from '../lib/checkUserAuthorization'
import { StatusCodes } from 'http-status-codes'
import { usersQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import methodNotAllowed from '../lib/methodNotAllowed'

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

export type PermissionsData = {
  uid: number
  groups: number[]
}

export default async function permissionsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PermissionsData>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    if (!(await checkUserAuthorization(req))) {
      res.status(StatusCodes.UNAUTHORIZED).end('Not authorized')
      return
    }

    const queryResult = await usersQuery<{
      uid: number
      usergroup: number
      additionalgroups: string
    }>(SQL`
      SELECT uid, usergroup, additionalgroups
      FROM mybb_users
      WHERE uid=${req.cookies.userid}
    `)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
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
      res.status(StatusCodes.NOT_FOUND).end('User permissions not found')
      return
    }

    const [user] = queryResult

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: {
        uid: user.uid,
        groups: [
          user.usergroup,
          ...user.additionalgroups
            .split(',')
            .filter(Boolean)
            .map((group) => parseInt(group)),
        ],
      },
    })
  }

  methodNotAllowed(req, res, allowedMethods)
}
