import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { DELETE, PATCH } from '@constants/http-methods'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'

const allowedMethods: string[] = [DELETE, PATCH] as const
const cors = Cors({
  methods: allowedMethods,
})

export default async function cardsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === DELETE) {
    const cardID = req.query.cardID as string

    if (!cardID) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a cardID in your request',
      })
      return
    }

    const count = await cardsQuery<{ total: number }>(SQL`
      SELECT count(*) as total
      FROM cards
      WHERE cardID=${cardID}
    `)

    if ('error' in count) {
      console.error(count)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    if (count[0].total > 1) {
      console.error('Multiple cards with same id')
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Multiple cards with same id')
      return
    }

    if (count[0].total === 0) {
      console.error('Card not found')
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end('Card not found')
      return
    }

    const queryResult = await cardsQuery(SQL`
      DELETE FROM cards
      WHERE cardID=${cardID};  
    `)

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: null,
    })
    return
  }

  if (req.method === PATCH) {
    const cardID = req.query.cardID as string
    const card = req.body.card as Card

    if (!card || !cardID) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a cardID and card data in your request',
      })
      return
    }

    const count = await cardsQuery<{ total: number }>(SQL`
      SELECT count(*) as total
      FROM cards
      WHERE cardID=${cardID}
    `)

    if ('error' in count) {
      console.error(count)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    if (count[0].total > 1) {
      console.error('Multiple cards with same id')
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Multiple cards with same id')
      return
    }

    if (count[0].total === 0) {
      console.error('Card not found')
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end('Card not found')
      return
    }

    const queryResult = await cardsQuery(SQL`
      UPDATE cards
      SET player_name=${card.player_name},
        playerID=${card.playerID},
        teamID=${card.teamID},
        author_userID=${card.author_userID},
        approved=${card.approved},
        pullable=${card.pullable},
        author_paid=${card.author_paid},
        image_url=${card.image_url},
        card_rarity=${card.card_rarity},
        sub_type=${card.sub_type},
        season=${card.season},
        position=${card.position},
        overall=${card.overall},
        skating=${card.skating},
        shooting=${card.shooting},
        hands=${card.hands},
        checking=${card.checking},
        defense=${card.defense},
        high_shots=${card.high_shots},
        low_shots=${card.low_shots},
        quickness=${card.quickness},
        control=${card.control},
        conditioning=${card.conditioning}
      WHERE cardID=${cardID};
    `)

    if ('error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: null,
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
