import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { POST } from '@constants/http-methods'
import rarityMap from '@constants/rarity-map'
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
  const num = randomIntFromInterval(10000)

  if (num > 0 && num <= rarityMap.hallOfFame.rarity)
    return rarityMap.hallOfFame.label
  if (
    num > rarityMap.hallOfFame.rarity &&
    num <= rarityMap.hallOfFame.rarity + rarityMap.twoThousandClub.rarity
  )
    return rarityMap.twoThousandClub.label
  if (
    num > rarityMap.hallOfFame.rarity + rarityMap.twoThousandClub.rarity &&
    num <=
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity
  )
    return rarityMap.diamond.label
  if (
    num >
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity &&
    num <=
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity
  )
    return rarityMap.ruby.label
  if (
    num >
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity &&
    num <=
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity
  )
    return rarityMap.gold.label
  if (
    num >
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity &&
    num <=
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity +
        rarityMap.silver.rarity
  )
    return rarityMap.silver.label
  if (
    num >
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity +
        rarityMap.silver.rarity &&
    num <=
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity +
        rarityMap.silver.rarity +
        rarityMap.bronze.rarity
  )
    return rarityMap.bronze.label
  if (
    num >
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity +
        rarityMap.silver.rarity +
        rarityMap.bronze.rarity &&
    num <=
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity +
        rarityMap.silver.rarity +
        rarityMap.bronze.rarity +
        rarityMap.logo.rarity
  )
    return rarityMap.logo.label
  if (
    num >
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity +
        rarityMap.silver.rarity +
        rarityMap.bronze.rarity +
        rarityMap.logo.rarity &&
    num <=
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity +
        rarityMap.silver.rarity +
        rarityMap.bronze.rarity +
        rarityMap.logo.rarity +
        rarityMap.charity.rarity
  )
    return rarityMap.charity.label
  if (
    num >
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity +
        rarityMap.silver.rarity +
        rarityMap.bronze.rarity +
        rarityMap.logo.rarity +
        rarityMap.charity.rarity &&
    num <=
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity +
        rarityMap.silver.rarity +
        rarityMap.bronze.rarity +
        rarityMap.logo.rarity +
        rarityMap.charity.rarity +
        rarityMap.award.rarity
  )
    return rarityMap.award.label
  if (
    num >
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity +
        rarityMap.silver.rarity +
        rarityMap.bronze.rarity +
        rarityMap.logo.rarity +
        rarityMap.charity.rarity +
        rarityMap.award.rarity &&
    num <=
      rarityMap.hallOfFame.rarity +
        rarityMap.twoThousandClub.rarity +
        rarityMap.diamond.rarity +
        rarityMap.ruby.rarity +
        rarityMap.gold.rarity +
        rarityMap.silver.rarity +
        rarityMap.bronze.rarity +
        rarityMap.logo.rarity +
        rarityMap.charity.rarity +
        rarityMap.award.rarity +
        rarityMap.firstOverall.rarity
  )
    return rarityMap.award.label
  return rarityMap.bronze.label
}

const pullBaseCards = async (): Promise<Card[]> => {
  let pulledCards: Card[] = []
  for (let i = 0; i < 6; i++) {
    const rarity: string = getBasePackRarity()

    const card = await queryDatabase(
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

    const packResult = await queryDatabase(
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

    let pulledCards: Card[] = []
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
