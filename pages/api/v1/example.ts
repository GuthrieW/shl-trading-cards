import { NextApiRequest, NextApiResponse } from 'next'
import connect from './../database/connect'

const index = async (request: NextApiRequest, response: NextApiResponse) => {\
  const databaseConnection = connect()
  response.status(200).json({
    example: 'example',
  })

  databaseConnection.close()
}

export default index
