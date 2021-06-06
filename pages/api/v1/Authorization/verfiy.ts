import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '../../Database/database'

//   databaseConnection // get the user's id and loginKey from the database, then check to see if userID + "_" + loginKey is equal to the user's session cookie
const index = async (request: NextApiRequest, response: NextApiResponse) => {
  const { userId, loginKey } = request.query
  const results = await queryDatabase(
    `SELECT * FROM mybb_users where uid=${userId} AND loginkey=${loginKey}`
  )

  console.log('results', results)
}

export default index
