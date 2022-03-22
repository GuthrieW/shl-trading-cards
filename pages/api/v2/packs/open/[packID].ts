import { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from '@pages/api/database/database'
import { POST, rarityMap } from '@constants/index'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'

const allowedMethods = []
const cors = Cors({
  methods: allowedMethods,
})

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

const pullBaseCards = async (): Promise<Card[]> => {
  let pulledCards: Card[] = []
  for (let i = 0; i < 6; i++) {
    const rarity: string = getBasePackRarity()

    const card = await queryDatabase(SQL`
      SELECT cardID
      FROM admin_cards.cards
      WHERE card_rarity=${rarity}
        AND approved=1
      ORDER BY RAND()
      LIMIT 1;
    `)

    pulledCards.push(card[0])
  }

  return pulledCards
}

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query } = request

  // Open a pack that a user already owns
  // Need to pull 6 cards, then add those cards to a user's collection, then
  // update the pack to be opened
  if (method === POST) {
    const { packID } = query
    const packResult = await queryDatabase(SQL`
      SELECT packID,
        userID,
        packType,
        opened,
        purchasedDate,
        openDate
      FROM admin_cards.packs_owned
      WHERE packID=${packID};
    `)
    const pack = packResult[0]

    let pulledCards: Card[] = []
    if (pack.packType === 'Base') {
      pulledCards = await pullBaseCards()
    } else {
      response.status(StatusCodes.BAD_REQUEST).json({
        error: `Invalid pack type ${pack.packType}`,
      })
      return
    }

    pulledCards.map(async (pulledCard) => {
      await queryDatabase(SQL`
        INSERT INTO admin_cards.collection
          (userID, cardID, packID)
        VALUES
          (${pack.userID}, ${pulledCard.cardID}, ${packID});
      `)
    })

    await queryDatabase(SQL`
      UPDATE admin_cards.packs_owned
      SET opened=1
      WHERE packID=${packID};
    `)

    response.status(StatusCodes.OK).json({
      openingSuccessful: true,
    })
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
