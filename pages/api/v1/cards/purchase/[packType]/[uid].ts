import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { POST, rarityMap } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import axios from 'axios'

const randomIntFromInterval = (maximum: number): number => {
  const minimum = 0
  const num = Math.floor(Math.random() * maximum - minimum + 1) + minimum
  return num
}

const getRarity = (): string => {
  const num = randomIntFromInterval(1000)
  switch (true) {
    case num > 900:
      return rarityMap.diamond.label
    case num > 800:
      return rarityMap.ruby.label
    case num > 700:
      return rarityMap.gold.label
    case num > 600:
      return rarityMap.silver.label
    default:
      return rarityMap.bronze.label
  }
}

const getIsSkater = (): boolean => {
  return randomIntFromInterval(10) > 2
}

const pullCards = async (): Promise<Card[]> => {
  let pulledCards: Card[] = []
  for (let i = 0; i < 6; i++) {
    const rarity: string = getRarity()
    const isSkater: boolean = getIsSkater()

    const query = isSkater
      ? SQL`
          SELECT cardID
          FROM admin_cards.cards
          WHERE card_rarity=${rarity}
            AND 
            (
              position='F'
              OR position='D'
            )
            AND approved=1
          ORDER BY RAND()
          LIMIT 1;
      `
      : SQL`
          SELECT cardID
          FROM admin_cards.cards
          WHERE card_rarity=${rarity}
            AND position='G'
            AND approved=1
          ORDER BY RAND()
          LIMIT 1;
        `

    const card = await queryDatabase(query)
    pulledCards.push(card[0])
  }

  return pulledCards
}

const allowedMethods = [POST]
const cors = Cors({
  methods: allowedMethods,
})

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method } = request
  const { uid, packType } = request.query

  if (method === POST) {
    const bankResponse = await axios({
      method: POST,
      url: `http://localhost:9001/api/v1/purchase/cards?uid=${uid}&packType=${packType}`,
      data: {},
    })

    if (!bankResponse.data.purchaseSuccessful) {
      response.status(StatusCodes.BAD_REQUEST).json({
        error: 'Unsuccessful Purchase',
      })
      return
    }

    const pulledCards = await pullCards()
    pulledCards.map(async (pulledCard) => {
      await queryDatabase(SQL`
        INSERT INTO admin_cards.collection
          (userID, cardID, quantity, update_date)
        VALUES
          (${uid}, ${pulledCard.cardID}, 1, CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE quantity=(quantity + 1);
      `)
    })

    response.status(StatusCodes.OK).send('Purchase successful')
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).json({
    error: 'Invalid method',
    purchaseSuccessful: false,
  })
}

export default index
