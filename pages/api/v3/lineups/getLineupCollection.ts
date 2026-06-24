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
  // Center card fields
  c_cardID: number
  c_playerName: string
  c_team: number
  c_playerID: number
  c_card_rarity: string
  c_sub_type: string
  c_render_name?: string
  c_image_url?: string
  c_position: string
  c_overall: number
  c_skating?: number | null
  c_shooting?: number | null
  c_hands?: number | null
  c_checking?: number | null
  c_defense?: number | null
  c_high_shots?: number | null
  c_low_shots?: number | null
  c_quickness?: number | null
  c_control?: number | null
  c_conditioning?: number | null
  c_season: number
  c_leagueID?: number
  // Left wing card fields
  lw_cardID: number
  lw_playerName: string
  lw_team: number
  lw_playerID: number
  lw_card_rarity: string
  lw_sub_type: string
  lw_render_name?: string
  lw_image_url?: string
  lw_position: string
  lw_overall: number
  lw_skating?: number | null
  lw_shooting?: number | null
  lw_hands?: number | null
  lw_checking?: number | null
  lw_defense?: number | null
  lw_high_shots?: number | null
  lw_low_shots?: number | null
  lw_quickness?: number | null
  lw_control?: number | null
  lw_conditioning?: number | null
  lw_season: number
  lw_leagueID?: number
  // Right wing card fields
  rw_cardID: number
  rw_playerName: string
  rw_team: number
  rw_playerID: number
  rw_card_rarity: string
  rw_sub_type: string
  rw_render_name?: string
  rw_image_url?: string
  rw_position: string
  rw_overall: number
  rw_skating?: number | null
  rw_shooting?: number | null
  rw_hands?: number | null
  rw_checking?: number | null
  rw_defense?: number | null
  rw_high_shots?: number | null
  rw_low_shots?: number | null
  rw_quickness?: number | null
  rw_control?: number | null
  rw_conditioning?: number | null
  rw_season: number
  rw_leagueID?: number
  // Left defense card fields
  ld_cardID: number
  ld_playerName: string
  ld_team: number
  ld_playerID: number
  ld_card_rarity: string
  ld_sub_type: string
  ld_render_name?: string
  ld_image_url?: string
  ld_position: string
  ld_overall: number
  ld_skating?: number | null
  ld_shooting?: number | null
  ld_hands?: number | null
  ld_checking?: number | null
  ld_defense?: number | null
  ld_high_shots?: number | null
  ld_low_shots?: number | null
  ld_quickness?: number | null
  ld_control?: number | null
  ld_conditioning?: number | null
  ld_season: number
  ld_leagueID?: number
  // Right defense card fields
  rd_cardID: number
  rd_playerName: string
  rd_team: number
  rd_playerID: number
  rd_card_rarity: string
  rd_sub_type: string
  rd_render_name?: string
  rd_image_url?: string
  rd_position: string
  rd_overall: number
  rd_skating?: number | null
  rd_shooting?: number | null
  rd_hands?: number | null
  rd_checking?: number | null
  rd_defense?: number | null
  rd_high_shots?: number | null
  rd_low_shots?: number | null
  rd_quickness?: number | null
  rd_control?: number | null
  rd_conditioning?: number | null
  rd_season: number
  rd_leagueID?: number
  // Goalie card fields
  g_cardID: number
  g_playerName: string
  g_team: number
  g_playerID: number
  g_card_rarity: string
  g_sub_type: string
  g_render_name?: string
  g_image_url?: string
  g_position: string
  g_overall: number
  g_skating?: number | null
  g_shooting?: number | null
  g_hands?: number | null
  g_checking?: number | null
  g_defense?: number | null
  g_high_shots?: number | null
  g_low_shots?: number | null
  g_quickness?: number | null
  g_control?: number | null
  g_conditioning?: number | null
  g_season: number
  g_leagueID?: number
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
        center.playerID as c_playerID,
        center.author_userID as c_author_userID,
        center.card_rarity as c_card_rarity,
        center.sub_type as c_sub_type,
        center.render_name as c_render_name,
        center.image_url as c_image_url,
        center.position as c_position,
        center.overall as c_overall,
        center.skating as c_skating,
        center.shooting as c_shooting,
        center.hands as c_hands,
        center.checking as c_checking,
        center.defense as c_defense,
        center.high_shots as c_high_shots,
        center.low_shots as c_low_shots,
        center.quickness as c_quickness,
        center.control as c_control,
        center.conditioning as c_conditioning,
        center.season as c_season,
        center.leagueID as c_leagueID,
        -- Left wing card details
        leftWing.cardID as lw_cardID,
        leftWing.player_name as lw_playerName,
        leftWing.teamID as lw_team,
        leftWing.playerID as lw_playerID,
        leftWing.card_rarity as lw_card_rarity,
        leftWing.sub_type as lw_sub_type,
        leftWing.render_name as lw_render_name,
        leftWing.image_url as lw_image_url,
        leftWing.position as lw_position,
        leftWing.overall as lw_overall,
        leftWing.skating as lw_skating,
        leftWing.shooting as lw_shooting,
        leftWing.hands as lw_hands,
        leftWing.checking as lw_checking,
        leftWing.defense as lw_defense,
        leftWing.high_shots as lw_high_shots,
        leftWing.low_shots as lw_low_shots,
        leftWing.quickness as lw_quickness,
        leftWing.control as lw_control,
        leftWing.conditioning as lw_conditioning,
        leftWing.season as lw_season,
        leftWing.leagueID as lw_leagueID,
        -- Right wing card details
        rightWing.cardID as rw_cardID,
        rightWing.player_name as rw_playerName,
        rightWing.teamID as rw_team,
        rightWing.playerID as rw_playerID,
        rightWing.card_rarity as rw_card_rarity,
        rightWing.sub_type as rw_sub_type,
        rightWing.render_name as rw_render_name,
        rightWing.image_url as rw_image_url,
        rightWing.position as rw_position,
        rightWing.overall as rw_overall,
        rightWing.skating as rw_skating,
        rightWing.shooting as rw_shooting,
        rightWing.hands as rw_hands,
        rightWing.checking as rw_checking,
        rightWing.defense as rw_defense,
        rightWing.high_shots as rw_high_shots,
        rightWing.low_shots as rw_low_shots,
        rightWing.quickness as rw_quickness,
        rightWing.control as rw_control,
        rightWing.conditioning as rw_conditioning,
        rightWing.season as rw_season,
        rightWing.leagueID as rw_leagueID,
        -- Left defense card details
        leftDefense.cardID as ld_cardID,
        leftDefense.player_name as ld_playerName,
        leftDefense.teamID as ld_team,
        leftDefense.playerID as ld_playerID,
        leftDefense.card_rarity as ld_card_rarity,
        leftDefense.sub_type as ld_sub_type,
        leftDefense.render_name as ld_render_name,
        leftDefense.image_url as ld_image_url,
        leftDefense.position as ld_position,
        leftDefense.overall as ld_overall,
        leftDefense.skating as ld_skating,
        leftDefense.shooting as ld_shooting,
        leftDefense.hands as ld_hands,
        leftDefense.checking as ld_checking,
        leftDefense.defense as ld_defense,
        leftDefense.high_shots as ld_high_shots,
        leftDefense.low_shots as ld_low_shots,
        leftDefense.quickness as ld_quickness,
        leftDefense.control as ld_control,
        leftDefense.conditioning as ld_conditioning,
        leftDefense.season as ld_season,
        leftDefense.leagueID as ld_leagueID,
        -- Right defense card details
        rightDefense.cardID as rd_cardID,
        rightDefense.player_name as rd_playerName,
        rightDefense.teamID as rd_team,
        rightDefense.playerID as rd_playerID,
        rightDefense.card_rarity as rd_card_rarity,
        rightDefense.sub_type as rd_sub_type,
        rightDefense.render_name as rd_render_name,
        rightDefense.image_url as rd_image_url,
        rightDefense.position as rd_position,
        rightDefense.overall as rd_overall,
        rightDefense.skating as rd_skating,
        rightDefense.shooting as rd_shooting,
        rightDefense.hands as rd_hands,
        rightDefense.checking as rd_checking,
        rightDefense.defense as rd_defense,
        rightDefense.high_shots as rd_high_shots,
        rightDefense.low_shots as rd_low_shots,
        rightDefense.quickness as rd_quickness,
        rightDefense.control as rd_control,
        rightDefense.conditioning as rd_conditioning,
        rightDefense.season as rd_season,
        rightDefense.leagueID as rd_leagueID,
        -- Goalie card details
        goalie.cardID as g_cardID,
        goalie.player_name as g_playerName,
        goalie.teamID as g_team,
        goalie.playerID as g_playerID,
        goalie.card_rarity as g_card_rarity,
        goalie.sub_type as g_sub_type,
        goalie.render_name as g_render_name,
        goalie.image_url as g_image_url,
        goalie.position as g_position,
        goalie.overall as g_overall,
        goalie.skating as g_skating,
        goalie.shooting as g_shooting,
        goalie.hands as g_hands,
        goalie.checking as g_checking,
        goalie.defense as g_defense,
        goalie.high_shots as g_high_shots,
        goalie.low_shots as g_low_shots,
        goalie.quickness as g_quickness,
        goalie.control as g_control,
        goalie.conditioning as g_conditioning,
        goalie.season as g_season,
        goalie.leagueID as g_leagueID
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