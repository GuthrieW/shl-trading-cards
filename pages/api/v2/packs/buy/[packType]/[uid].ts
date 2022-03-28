import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { POST } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import axios from 'axios'

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query } = request

  // Purchase a pack by querying the banking API and then
  // insert that user's newpack into the packs_owned table
  if (method === POST) {
    const { uid, packType } = query

    if (!uid) {
      response.status(StatusCodes.BAD_REQUEST).json({
        error: 'Missing User ID',
        purchaseSuccessful: false,
      })
      return
    }

    if (!packType) {
      response.status(StatusCodes.BAD_REQUEST).json({
        error: 'Missing Pack Type',
        purchaseSuccessful: false,
      })
      return
    }

    const hasReachedLimit = await queryDatabase(SQL`
      SELECT packsToday
      FROM admin_cards.packToday
      WHERE userID=${uid};
    `)

    console.log(hasReachedLimit)

    if (hasReachedLimit[0].packsToday >= 3) {
      response.status(StatusCodes.BAD_REQUEST).json({
        error: 'Daily Pack Limit Reached',
        purchaseSuccessful: false,
      })
      return
    }

    const bankResponse = await axios({
      method: POST,
      url: `http://bank.simulationhockey.com/api/v1/purchase/cards/${packType}/${uid}`,
      data: {},
    })

    console.log('bankResponse', bankResponse.data)

    if (!bankResponse.data.purchaseSuccessful) {
      response.status(StatusCodes.BAD_REQUEST).json({
        error: 'Insufficient Bank Balance',
        purchaseSuccessful: false,
      })
      return
    }

    const result = await queryDatabase(SQL`
      INSERT INTO admin_cards.packs_owned
        (userID, packType, source)
      VALUES
        (${uid}, ${packType}, "Pack Shop");
    `)

    console.log('purchase result', result)

    response.status(StatusCodes.OK).json({
      purchaseSuccessful: true,
    })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
