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
  console.log(authHeader)

  if (!authHeader?.startsWith(bearerPrefix)) {
    console.error('Missing valid bearer prefix')
    return false
  }

  const token: string = authHeader.substring(
    bearerPrefix.length,
    authHeader.length
  )

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET ?? '')

    if (typeof decodedToken === 'string' || !('userid' in decodedToken)) {
      console.error('Decoded token is malformed', decodedToken)
      return false
    }

    const useridCookieMatchesToken: boolean =
      req.cookies.userid === decodedToken.userid.toString()

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

      if ('error' in roleQuery) {
        console.error(roleQuery.error)
        return false
      }

      if (roleQuery.length === 0) {
        console.error(`No users found with userid: ${decodedToken.userid}`)
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

      if (
        'sudo' in req.cookies &&
        req.cookies.sudo === 'true' &&
        groups.includes(userGroups.TRADING_CARD_ADMIN)
      ) {
        return useridCookieMatchesToken
      }

      return (
        useridCookieMatchesToken &&
        groups.some((group) => {
          if (typeof options.validRoles === 'string') {
            return userGroups[options.validRoles] === group
          }
          return options.validRoles?.some((role) => userGroups[role] === group)
        })
      )
    }

    return useridCookieMatchesToken
  } catch (error) {
    return false
  }
}
