import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '..'
import middleware from '@pages/api/database/middleware'
import { POST } from '@constants/http-methods'
import Cors from 'cors'
import methodNotAllowed from '../lib/methodNotAllowed'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'
import { HttpStatusCode } from 'axios'

const allowedMethods: string[] = [POST]
const cors = Cors({
  methods: allowedMethods,
})

export default async function baseRequestsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<
    ApiResponse<{ skaterErrors: string[]; goalieErrors: string[] }>
  >
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === POST) {
    const cardsToInsert = (req.body.cards ?? []) as Partial<Card>[]

    const insertQuery = SQL`
      INSERT INTO cards
        (player_name, render_name, teamID, playerID, card_rarity, sub_type, pullable, approved, position, overall, high_shots, low_shots, quickness, control, conditioning, skating, shooting, hands, checking, defense, season, author_paid)
      VALUES`

    cardsToInsert.forEach((card, index) => {
      if (index !== 0) {
        insertQuery.append(SQL`,`)
      }
      insertQuery.append(
        SQL` (${card.player_name}, ${card.render_name}, ${card.teamID}, ${card.playerID}, ${card.card_rarity}, ${card.sub_type}, 0, 0, ${card.position}, ${card.overall}, ${card.high_shots}, ${card.low_shots}, ${card.quickness}, ${card.control}, ${card.conditioning}, ${card.skating}, ${card.shooting}, ${card.hands}, ${card.checking}, ${card.defense}, ${card.season}, 0)`
      )
    })

    await cardsQuery(insertQuery)

    res.status(HttpStatusCode.Ok).json({ status: 'success', payload: null })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
