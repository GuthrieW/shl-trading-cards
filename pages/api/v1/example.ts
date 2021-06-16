import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '../database/database'

const index = async (request: NextApiRequest, response: NextApiResponse) => {
  const results = await queryDatabase(
    `SELECT * FROM admin_testdb.mybb_users where username="caltroit_red_flames";`
  )
  response.status(200).json({ results: results })
}

export default index
