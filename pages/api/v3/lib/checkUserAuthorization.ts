import { userGroups } from 'lib/constants'
import { NextApiRequest } from 'next'
import * as jwt from 'jsonwebtoken'
import { usersQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'

export const checkUserAuthorization = async (
  req: NextApiRequest,
  options?: {
    validRoles?:
      | keyof Readonly<typeof userGroups>
      | (keyof Readonly<typeof userGroups>)[]
  }
): Promise<boolean> => {
  const authHeader: string = req.headers.authorization
  const bearerPrefix: string = 'Bearer '

  if (!authHeader?.startsWith(bearerPrefix)) {
    return false
  }

  const token: string = authHeader.substring(
    bearerPrefix.length,
    authHeader.length
  )

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET ?? '')

    if (typeof decodedToken === 'string' || !('userid' in decodedToken)) {
      return false
    }

    if (options?.validRoles) {
      const roleQuery = await usersQuery<{
        uid: number
        usergroup: number
        additionalgroups: string
      }>(SQL`
        SELECT uid, usergroup, additionalgroups
        FROM mybb_users
        WHERE uid=${decodedToken.userid}
      `)

      if ('error' in roleQuery || roleQuery.length === 0) {
        return false
      }

      const [roleUser] = roleQuery
      const groups = [
        roleUser.usergroup,
        ...roleUser.additionalgroups
          .split(',')
          .filter(Boolean)
          .map((group) => parseInt(group)),
      ]

      return (
        req.cookies.userid === decodedToken.userid.toString() &&
        groups.some((group) => {
          if (typeof options.validRoles === 'string') {
            return userGroups[options.validRoles] === group
          }
          return options.validRoles?.some((role) => userGroups[role] === group)
        })
      )
    }

    return req.cookies.userid === decodedToken.userid.toString()
  } catch (error) {
    return false
  }
}
