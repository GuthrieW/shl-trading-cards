import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { GET } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'

const allowedMethods = [GET]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query } = request

  // TODO: implement this method
  // This needs to get the cards that were pulled from the most recently opened pack by the user
  // We can do this by getting the most recently opened packID from packs_owned,
  // then the cardIDs in the collection table which match the packID and the userID,
  // then return the card information for the cards which match those cardIDs
  // So that's 3 queries
  if (method === GET) {
    const { uid } = query
    response
      .status(StatusCodes.NOT_IMPLEMENTED)
      .json({ error: 'Method not implemented' })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
