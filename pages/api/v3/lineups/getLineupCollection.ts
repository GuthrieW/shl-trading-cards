import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse, SortDirection } from '..'
import middleware from '@pages/api/database/middleware'
import { GET } from '@constants/http-methods'
import Cors from 'cors'
import SQL, { SQLStatement } from 'sql-template-strings'
import { cardsQuery } from '@pages/api/database/database'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'
import { rateLimit } from 'lib/rateLimit'

export type GameLineup = {
  lineupID: number
  userID: number
  lineupTitle: string
  c_playerName: string
  c_team: string
  c_overall: number
  c_position: string
  c_image_url: string
  c_card_rarity: string
  lw_playerName: string
  lw_team: string
  lw_overall: number
  lw_position: string
  lw_image_url: string
  lw_card_rarity: string
  rw_playerName: string
  rw_team: string
  rw_overall: number
  rw_position: string
  rw_image_url: string
  rw_card_rarity: string
  ld_playerName: string
  ld_team: string
  ld_overall: number
  ld_position: string
  ld_image_url: string
  ld_card_rarity: string
  rd_playerName: string
  rd_team: string
  rd_overall: number
  rd_position: string
  rd_image_url: string
  rd_card_rarity: string
  g_playerName: string
  g_team: string
  g_overall: number
  g_position: string
  g_image_url: string
  g_card_rarity: string
}

export type GameLineupSortValue = keyof GameLineup
export type GameLineupSortOption = {
  value: keyof GameLineup
  label: string
  sortLabel: (direction: SortDirection) => string
}

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<GameLineup>>>
) => {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const uid = req.query.uid as string
    const lineupTitle = req.query.lineupTitle as string
    const lineupId = req.query.lineupId as string
    const limit = (req.query.limit ?? 15) as string
    const offset = (req.query.offset ?? 0) as string
    const sortColumn = (req.query.sortColumn ??
      'lineupTitle') as keyof Readonly<GameLineup>
    const sortDirection = (req.query.sortDirection ?? 'DESC') as SortDirection

    if (!uid) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a uid in your request',
        payload: null,
      })
      return
    }

    // Build the base query with proper column aliases
    const queryString: SQLStatement = SQL`
      SELECT 
        gl.lineupID,
        gl.userID,
        gl.lineupTitle,
        -- Center card details
        center.cardID as c_cardID,
        center.player_name as c_playerName,
        center.teamID as c_team,
        center.overall as c_overall,
        center.position as c_position,
        center.image_url as c_image_url,
        center.card_rarity as c_card_rarity,
        -- Left wing card details
        leftWing.cardID as lw_cardID,
        leftWing.player_name as lw_playerName,
        leftWing.teamID as lw_team,
        leftWing.overall as lw_overall,
        leftWing.position as lw_position,
        leftWing.image_url as lw_image_url,
        leftWing.card_rarity as lw_card_rarity,
        -- Right wing card details
        rightWing.cardID as rw_cardID,
        rightWing.player_name as rw_playerName,
        rightWing.teamID as rw_team,
        rightWing.overall as rw_overall,
        rightWing.position as rw_position,
        rightWing.image_url as rw_image_url,
        rightWing.card_rarity as rw_card_rarity,
        -- Left defense card details
        leftDefense.cardID as ld_cardID,
        leftDefense.player_name as ld_playerName,
        leftDefense.teamID as ld_team,
        leftDefense.overall as ld_overall,
        leftDefense.position as ld_position,
        leftDefense.image_url as ld_image_url,
        leftDefense.card_rarity as ld_card_rarity,
        -- Right defense card details
        rightDefense.cardID as rd_cardID,
        rightDefense.player_name as rd_playerName,
        rightDefense.teamID as rd_team,
        rightDefense.overall as rd_overall,
        rightDefense.position as rd_position,
        rightDefense.image_url as rd_image_url,
        rightDefense.card_rarity as rd_card_rarity,
        -- Goalie card details
        goalie.cardID as g_cardID,
        goalie.player_name as g_playerName,
        goalie.teamID as g_team,
        goalie.overall as g_overall,
        goalie.position as g_position,
        goalie.image_url as g_image_url,
        goalie.card_rarity as g_card_rarity
      FROM game_lineup gl
      LEFT JOIN cards center ON gl.centerCardID = center.cardID
      LEFT JOIN cards leftWing ON gl.leftWingCardID = leftWing.cardID
      LEFT JOIN cards rightWing ON gl.rightWingCardID = rightWing.cardID
      LEFT JOIN cards leftDefense ON gl.leftDefenseCardID = leftDefense.cardID
      LEFT JOIN cards rightDefense ON gl.rightDefenseCardID = rightDefense.cardID
      LEFT JOIN cards goalie ON gl.goalieCardID = goalie.cardID
      WHERE gl.userID = ${uid}
    `
    if (lineupId) {
      queryString.append(SQL` AND gl.lineupID = ${lineupId}`)
    }
    // Add search filter for lineupTitle if provided
    if (lineupTitle) {
      queryString.append(SQL` AND lineupTitle LIKE ${`%${lineupTitle}%`}`)
    }

    // Add sorting
    queryString.append(SQL` ORDER BY`)
    if (sortColumn === 'lineupTitle') {
      queryString.append(SQL` lineupTitle`)
      sortDirection === 'ASC'
        ? queryString.append(SQL` ASC`)
        : queryString.append(SQL` DESC`)
    } else {
      // Default sort
      queryString.append(SQL` created_at DESC`)
    }

    // Add pagination
    const limitNum = Math.min(Math.max(parseInt(limit) || 15, 1), 100)
    const offsetNum = Math.max(parseInt(offset) || 0, 0)

    queryString.append(SQL` LIMIT ${limitNum} OFFSET ${offsetNum}`)

    // Execute the main query
    const queryResult = await cardsQuery<GameLineup>(queryString)
    if ('error' in queryResult) {
      console.error(queryResult.error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Database connection failed',
        payload: null,
      })
      return
    }

    // Get total count for pagination
    const countQuery: SQLStatement = SQL`
      SELECT COUNT(*) as total
      FROM game_lineup 
      WHERE userID = ${uid}
    `

    if (lineupTitle) {
      countQuery.append(SQL` AND lineupTitle LIKE ${`%${lineupTitle}%`}`)
    }

    const countResult = await cardsQuery<{ total: number }>(countQuery)
    if ('error' in countResult) {
      console.error(countResult.error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Database connection failed',
        payload: null,
      })
      return
    }

    const total = countResult[0]?.total || 0

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: {
        rows: queryResult,
        total: total,
      },
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}

export default rateLimit(handler)