import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { GET, POST } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'

const allowedMethods = [GET, POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { body, method, query } = request

  if (method === GET) {
    const { id } = query

    const result = await queryDatabase(SQL`
      SELECT
        card.cardID, 
        card.player_name,
        card.card_rarity,
        card.position
      FROM admin_cards.cards card
        LEFT JOIN admin_cards.card_sets card_set
        ON card.cardID=card_set.cardID
      WHERE setID=${id};
    `)

    response.status(StatusCodes.OK).json(result)
    return
  }

  if (method === POST) {
    const { id } = query
    const { name, description, cardIds } = body
    console.log('body', body)

    const setResult = await queryDatabase(SQL`
      UPDATE admin_cards.sets
      SET name=${name},
        description=${description}
      WHERE setID=${id};
    `)
    console.log('setResult', setResult)

    const removeResult = await queryDatabase(SQL`
      DELETE FROM admin_cards.card_sets
      WHERE setID=${id};
    `)
    console.log('removeResult', removeResult)

    cardIds.map(async (cardID: string) => {
      const addResult = await queryDatabase(SQL`
        INSERT INTO admin_cards.card_sets
          (cardID, setID)
        VALUES
          (${cardID}, ${id});
      `)
    })

    response.status(StatusCodes.OK).json({})
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
