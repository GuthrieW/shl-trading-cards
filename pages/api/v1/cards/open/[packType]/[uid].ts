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

/**
 * Diamond - 1.5%
 * Ruby - 3%
 * Gold - 25.5%
 * Silver - 30%
 * Bronze - 40%
 */

const getBasePackRarity = (): string => {
  const num = randomIntFromInterval(10000)
  if (num > 0 && num <= 150) return rarityMap.diamond.label
  if (num > 150 && num <= 450) return rarityMap.ruby.label
  if (num > 450 && num <= 3000) return rarityMap.gold.label
  if (num > 3000 && num <= 6000) return rarityMap.silver.label
  if (num > 6000 && num <= 10000) return rarityMap.bronze.label
  return rarityMap.bronze.label
}

const getIsSkater = (): boolean => {
  return randomIntFromInterval(10) > 2
}

const pullCards = async (): Promise<Card[]> => {
  let pulledCards: Card[] = []
  for (let i = 0; i < 6; i++) {
    const rarity: string = getBasePackRarity()
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
        purchaseSuccessful: false,
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
        ON DUPLICATE KEY UPDATE quantity=(quantity + 1), update_date=CURRENT_TIMESTAMP;
      `)
    })

    const consumePack = await queryDatabase(SQL`
      UPDATE admin_cards.packs_owned
      SET quantity = quantity - 1
      WHERE userID = ${uid};
    `)

    response.status(StatusCodes.OK).json({
      purchaseSuccessful: true,
    })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).json({
    error: 'Invalid method',
    purchaseSuccessful: false,
  })
}

export default index
