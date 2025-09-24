import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse, ListTotal, SortDirection } from '../..'
import middleware from '@pages/api/database/middleware'
import { GET } from '@constants/http-methods'
import Cors from 'cors'
import SQL, { SQLStatement } from 'sql-template-strings'
import { cardsQuery } from '@pages/api/database/database'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../../lib/methodNotAllowed'
import { rateLimit } from 'lib/rateLimit'

export type OwnedCard = {
  quantity: number
  cardID: number
  teamID: number
  teamName: string
  teamNickName: string
  player_name: string
  position: 'F' | 'D' | 'G'
  season: number
  card_rarity: string
  image_url: string
  overall: number
  skating: number
  shooting: number
  hands: number
  checking: number
  defense: number
  high_shots: number
  low_shots: number
  quickness: number
  control: number
  conditioning: number
  playerID: number
  leagueID: number
}

export type OwnedCardSortValue = keyof OwnedCard
export type OwnedCardSortOption = {
  value: keyof OwnedCard
  label: string
  sortLabel: (direction: SortDirection) => string
}

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<OwnedCard>>>
) => {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const uid = req.query.uid as string
    const playerName = req.query.playerName as string
    const teams = JSON.parse(req.query.teams as string) as string[]
    const rarities = JSON.parse(req.query.rarities as string) as string[]
    const subType = JSON.parse(req.query.subType as string) as string[]
    const limit = (req.query.limit ?? 10) as string
    const offset = (req.query.offset ?? 0) as string
    const sortColumn = (req.query.sortColumn ??
      'overall') as keyof Readonly<OwnedCard>
    const sortDirection = (req.query.sortDirection ?? 'DESC') as SortDirection
    const showNotOwnedCards = (req.query.showNotOwnedCards ?? 'false') as
      | 'true'
      | 'false'
    const otherUID = req.query.otherUID as string
    const leagueID = (req.query.leagueID as string) || '0'

    if (!uid) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a uid in your request',
      })
      return
    }

    const countQuery: SQLStatement =
      showNotOwnedCards === 'true'
        ? SQL`
        WITH usercollection AS (
          SELECT * FROM ownedCards WHERE userid=${parseInt(uid)}
        )
        SELECT 
          COUNT(*) AS total, 
          SUM(CASE WHEN ownedCard.quantity > 0 THEN 1 ELSE 0 END) AS totalOwned
        FROM cards card
        LEFT JOIN userCollection ownedCard
          ON card.cardID=ownedCard.cardID
        WHERE approved=1
      `
        : SQL`
        SELECT 
          COUNT(*) AS total, 
          SUM(CASE WHEN ownedCard.quantity > 0 THEN 1 ELSE 0 END) AS totalOwned
        FROM cards card
        LEFT JOIN ownedCards ownedCard
          ON card.cardID=ownedCard.cardID
        WHERE ownedCard.userID=${parseInt(uid)}
      `

    const query: SQLStatement =
      showNotOwnedCards === 'true'
        ? SQL`
        WITH usercollection AS (
          select * from ownedCards where userid=${parseInt(uid)} 
        )

        SELECT COALESCE(ownedCard.quantity, 0) as quantity,
          card.cardID,
          team.Name as teamName,
          team.Nickname as teamNickName,
          card.teamID,
          card.player_name,
          card.position,
          card.card_rarity,
          card.season,
          card.image_url,
          card.overall,
          card.skating,
          card.shooting,
          card.hands,
          card.checking,
          card.defense,
          card.high_shots,
          card.low_shots,
          card.quickness,
          card.control,
          card.conditioning,
          card.playerID
        FROM cards card
        LEFT JOIN userCollection ownedCard
          ON card.cardID=ownedCard.cardID
        LEFT JOIN team_data team
          ON card.teamID=team.teamID and ${parseInt(leagueID)}=team.LeagueID
        WHERE approved=1
      `
        : SQL`
        SELECT ownedCard.quantity,
          ownedCard.cardID,
          team.Name as teamName,
          team.Nickname as teamNickName,
          card.teamID,
          card.player_name,
          card.position,
          card.card_rarity,
          card.season,
          card.image_url,
          card.overall,
          card.skating,
          card.shooting,
          card.hands,
          card.checking,
          card.defense,
          card.high_shots,
          card.low_shots,
          card.quickness,
          card.control,
          card.conditioning,
          card.playerID
        FROM cards card
        LEFT JOIN ownedCards ownedCard
          ON card.cardID=ownedCard.cardID
        LEFT JOIN team_data team
          ON card.teamID=team.teamID and ${parseInt(leagueID)}=team.LeagueID
        WHERE ownedCard.userID=${parseInt(uid)} 
      `

    countQuery.append(SQL` AND card.leagueID=${parseInt(leagueID)}`)
    query.append(SQL` AND card.leagueID=${parseInt(leagueID)}`)

    if (playerName.length !== 0) {
      countQuery.append(SQL` AND card.player_name LIKE ${`%${playerName}%`}`)
      query.append(SQL` AND card.player_name LIKE ${`%${playerName}%`}`)
    }

    if (teams.length !== 0) {
      countQuery.append(SQL` AND (`)
      teams.forEach((team, index) =>
        index === 0
          ? countQuery.append(SQL`card.teamID=${parseInt(team)}`)
          : countQuery.append(SQL` OR card.teamID=${parseInt(team)}`)
      )
      countQuery.append(SQL`)`)

      query.append(SQL` AND (`)
      teams.forEach((team, index) =>
        index === 0
          ? query.append(SQL`card.teamID=${parseInt(team)}`)
          : query.append(SQL` OR card.teamID=${parseInt(team)}`)
      )
      query.append(SQL`)`)
    }

    if (otherUID) {
      countQuery.append(
        SQL` AND card.cardID NOT IN (
        SELECT cardID 
        FROM ownedCards 
        WHERE userID =${parseInt(otherUID)} )`
      )
      query.append(
        SQL` AND card.cardID NOT IN (
        SELECT cardID 
        FROM ownedCards 
        WHERE userID =${parseInt(otherUID)} )`
      )
    }
    if (rarities.length !== 0) {
      countQuery.append(SQL` AND (`)
      rarities.forEach((rarity, index) =>
        index === 0
          ? countQuery.append(SQL`card.card_rarity=${rarity}`)
          : countQuery.append(SQL` OR card.card_rarity=${rarity}`)
      )
      countQuery.append(SQL`)`)

      query.append(SQL` AND (`)
      rarities.forEach((rarity, index) =>
        index === 0
          ? query.append(SQL`card.card_rarity=${rarity}`)
          : query.append(SQL` OR card.card_rarity=${rarity}`)
      )
      query.append(SQL`)`)
    }
    if (subType.length !== 0) {
      countQuery.append(SQL` AND (`)
      subType.forEach((sub_type, index) =>
        index === 0
          ? countQuery.append(SQL`card.sub_type=${sub_type}`)
          : countQuery.append(SQL` OR card.sub_type=${sub_type}`)
      )
      countQuery.append(SQL`)`)
      query.append(SQL` AND (`)
      subType.forEach((sub_type, index) =>
        index === 0
          ? query.append(SQL`card.sub_type=${sub_type}`)
          : query.append(SQL` OR card.sub_type=${sub_type}`)
      )
      query.append(SQL`)`)
    }

    query.append(SQL` ORDER BY`)
    if (sortColumn === 'overall') {
      query.append(SQL` card.overall`)
      sortDirection === 'ASC'
        ? query.append(SQL` ASC`)
        : query.append(SQL` DESC`)
    }

    if (sortColumn === 'quantity') {
      query.append(SQL` ownedCard.quantity`)
      sortDirection === 'ASC'
        ? query.append(SQL` ASC`)
        : query.append(SQL` DESC`)
    }

    if (sortColumn === 'player_name') {
      query.append(SQL` card.player_name`)
      sortDirection === 'DESC'
        ? query.append(SQL` ASC`)
        : query.append(SQL` DESC`)
      query.append(SQL`, card.overall DESC`)
    }

    if (sortColumn === 'teamID') {
      if (leagueID === '2') {
        query.append(SQL` team.NickName`)
      } else {
        query.append(SQL` team.Name`)
      }

      sortDirection === 'DESC'
        ? query.append(SQL` ASC`)
        : query.append(SQL` DESC`)
      query.append(SQL`, card.overall DESC`)
    }
    if (sortColumn === 'season') {
      query.append(SQL` card.season`)
      sortDirection === 'DESC'
        ? query.append(SQL` ASC`)
        : query.append(SQL` DESC`)
      query.append(SQL`, card.overall DESC`)
    }

    if (limit) {
      query.append(SQL` LIMIT ${parseInt(limit)}`)
    }

    if (offset) {
      query.append(SQL` OFFSET ${parseInt(offset)}`)
    }
    const countResult = await cardsQuery<ListTotal>(countQuery)
    if ('error' in countResult) {
      console.error(countResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    const queryResult = await cardsQuery<OwnedCard>(query)

    if ('error' in queryResult) {
      console.error(queryResult.error)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: {
        rows: queryResult,
        total: countResult[0].total,
        totalOwned: countResult[0].totalOwned,
      },
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
export default rateLimit(handler)
