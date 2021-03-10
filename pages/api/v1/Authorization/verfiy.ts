import { NextApiRequest, NextApiResponse } from 'next'
import { openConnection } from './../../database/connect'

//   databaseConnection // get the user's id and loginKey from the database, then check to see if userID + "_" + loginKey is equal to the user's session cookie
const index = async (request: NextApiRequest, response: NextApiResponse) => {
  const { userId, loginKey } = request.query
  const databaseConnection = openConnection()
  databaseConnection.query(
    `SELECT * FROM mybb_users where uid=:userId AND loginkey=:loginKey`,
    {
      userId: userId,
      loginKey: loginKey,
    },
    (error, results, fields) => {
      databaseConnection.end()
      if (error) {
        console.log(error)
      }

      const verified = results.length > 0 ?? false
      response.status(200).json({ verified: verified })
    }
  )
}

export default index
