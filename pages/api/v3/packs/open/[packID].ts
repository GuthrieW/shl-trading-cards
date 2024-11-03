import { NextApiRequest, NextApiResponse } from 'next'
import {
    cardsQuery,
} from '@pages/api/database/database'
import { POST } from '@constants/http-methods'
import {rarityMapRubyPlus ,rarityMap , Rarity } from '@constants/rarity-map'
import { StatusCodes } from 'http-status-codes'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import SQL from 'sql-template-strings'
// import packsMap from '@constants/packs-map'
import assertBoom from '@pages/api/lib/assertBoom'
import { packService } from 'services/packService'

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
    if (num > counter && num <= counter + rarity.rarity) {
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
  
      const cardResult = await cardsQuery(
        SQL`
        SELECT cardID
        FROM cards
        WHERE card_rarity=${rarity}
          AND approved=1
        ORDER BY RAND()
        LIMIT 1;`
      )
  
      if (cardResult) {
        pulledCards.push(cardResult[0]) 
      } else {
        throw new Error('No card found or query failed.')
      }
    }
  
  return pulledCards
}

const getRubyPlusPackRarity = (): string => {
  const num: number = randomIntFromInterval(10000)
  const rarities: Rarity[] = Object.values(rarityMapRubyPlus)

  let counter = 0
  const foundRarityRecord = rarities.find((rarity, index) => {
    if (num > counter && num <= counter + rarity.rarity) {
      return true
    }

    counter += rarity.rarity
    return false
  })

  return foundRarityRecord.label
}

const pullRubyPlusCards = async (): Promise<{ cardID: string }[]> => {
  let pulledCards: { cardID: string }[] = []
  for (let i = 0; i < 6; i++) {
    const rarity: string = getRubyPlusPackRarity()

    const cardResult = await cardsQuery(
      SQL`
      SELECT cardID 
      FROM cards
      WHERE card_rarity=${rarity}
        AND approved=1
      ORDER BY RAND()
      LIMIT 1;`
    )

    if (cardResult) {
      pulledCards.push(cardResult[0])
    } else {
      throw new Error('No card found or query failed.')
    }
  }

  return pulledCards
}

const index = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  await middleware(request, response, cors)
  const { method, query } = request

  if (method === POST) {
    const { packID } = query

    const missingPackId: boolean = assertBoom(
      !!packID,
      response,
      'Missing Pack ID',
      StatusCodes.BAD_REQUEST
    )
    if (missingPackId) return

    const packResult = await cardsQuery<PackData>(
      SQL`
      SELECT packID,
        userID,
        packType,
        opened,
        purchaseDate,
        openDate
      FROM packs_owned
      WHERE packID=${packID};`
    )

    const pack: PackData = packResult[0]

    const packAlreadyOpened: boolean = assertBoom(
      !Boolean(pack.opened),
      response,
      'Pack Already Opened',
      StatusCodes.BAD_REQUEST
    )
    if (packAlreadyOpened) return

    let pulledCards: { cardID: string }[] = []
    
    if (pack.packType === packService.packs.base.id) {
      pulledCards = await pullBaseCards()
    } else if (pack.packType === packService.packs.rubyPlus.id) {
      pulledCards = await pullRubyPlusCards()
    } else {
      response.status(StatusCodes.BAD_REQUEST).json({
        error: `Invalid pack type ${pack.packType}`,
      })
      return
    }

    pulledCards.map(async (pulledCard) => {
      await cardsQuery(
        SQL`
        INSERT INTO collection
          (userID, cardID, packID)
        VALUES
          (${pack.userID}, ${pulledCard.cardID}, ${packID});`)
    })

    await cardsQuery(
      SQL`
      UPDATE packs_owned
      SET opened=1, openDate=CURRENT_TIMESTAMP
      WHERE packID=${packID};`
    )

    response.status(StatusCodes.OK).json({ openingSuccessful: true })
    return
  }

  response.setHeader('Allowed', allowedMethods)
  response.status(StatusCodes.METHOD_NOT_ALLOWED).end()
}

export default index