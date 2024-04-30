import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { POST } from '@constants/http-methods'
import rarityMap, { Rarity } from '@constants/rarity-map'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
import packsMap from '@constants/packs-map'
import checkBoom from '@pages/api/lib/checkBoom'

const allowedMethods = []
const cors = Cors({
  methods: allowedMethods,
})

const randomIntFromInterval = (maximum: number): number => {
  const minimum = 0
  const num = Math.floor(Math.random() * maximum - minimum + 1) + minimum
  return num
}

const getBasePackRarity = (): string => {
  const num: number = randomIntFromInterval(10000)
  const rarities: Rarity[] = Object.values(rarityMap)

  let counter = 0
  const foundRarityRecord = rarities.find((rarity, index) => {
    if (num > counter && num <= num + rarity.rarity) {
      return true
    }

    counter += rarity.rarity
    return false
  })

  return foundRarityRecord.label
}

const pullBaseCards = async (): Promise<{ cardID: string }[]> => {
  let pulledCards: { cardID: string }[] = []
  for (let i = 0; i < 6; i++) {
    const rarity: string = getBasePackRarity()

    const card: { cardID: string }[] = await queryDatabase(
      SQL`
      SELECT cardID
      FROM `.append(getCardsDatabaseName()).append(SQL`.cards
      WHERE card_rarity=${rarity}
        AND approved=1
      ORDER BY RAND()
      LIMIT 1;
    `)
    )

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

    const missingPackId: boolean = checkBoom(
      !!packID,
      'Missing Pack ID',
      StatusCodes.BAD_REQUEST,
      response
    )
    if (missingPackId) return

    const packResult = await queryDatabase<PackData>(
      SQL`
      SELECT packID,
        userID,
        packType,
        opened,
        purchaseDate,
        openDate
      FROM `.append(getCardsDatabaseName()).append(SQL`.packs_owned
      WHERE packID=${packID};
    `)
    )

    const pack: PackData = packResult[0]

    const packAlreadyOpened: boolean = checkBoom(
      !Boolean(pack.opened),
      'Pack Already Opened',
      StatusCodes.BAD_REQUEST,
      response
    )
    if (packAlreadyOpened) return

    let pulledCards: { cardID: string }[] = []
    if (pack.packType === packsMap.base.id) {
      pulledCards = await pullBaseCards()
    } else {
      response.status(StatusCodes.BAD_REQUEST).json({
        error: `Invalid pack type ${pack.packType}`,
      })
      return
    }

    pulledCards.map(async (pulledCard) => {
      await queryDatabase(
        SQL`
        INSERT INTO `.append(getCardsDatabaseName()).append(SQL`.collection
          (userID, cardID, packID)
        VALUES
          (${pack.userID}, ${pulledCard.cardID}, ${packID});
      `)
      )
    })

    await queryDatabase(
      SQL`
      UPDATE `.append(getCardsDatabaseName()).append(SQL`.packs_owned
      SET opened=1, openDate=CURRENT_TIMESTAMP
      WHERE packID=${packID};
    `)
    )

    response.status(StatusCodes.OK).json({ openingSuccessful: true })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index
