import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse, ListTotal, SortDirection } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET, PATCH } from '@constants/http-methods'
import { cardsQuery } from '@pages/api/database/database'
import SQL, { SQLStatement } from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'

const allowedMethods: string[] = [GET] as const
const cors = Cors({
  methods: allowedMethods,
})

export default async function cardsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<Card>>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === GET) {
    const limit = (req.query.limit ?? 10) as string
    const offset = (req.query.offset ?? 0) as string
    const sortColumn = (req.query.sortColumn ??
      'cardID') as keyof Readonly<Card>
    const sortDirection = (req.query.sortDirection ?? 'ASC') as SortDirection
    const viewSkaters = (req.query.viewSkaters ?? 'false') as 'true' | 'false'
    const viewNeedsAuthor = (req.query.viewNeedsAuthor ?? 'false') as
      | 'true'
      | 'false'
    const viewNeedsImage = (req.query.viewNeedsImage ?? 'false') as
      | 'true'
      | 'false'
    const viewNeedsApproval = (req.query.viewNeedsApproval ?? 'false') as
      | 'true'
      | 'false'
    const viewNeedsAuthorPaid = (req.query.viewNeedsAuthorPaid ?? 'false') as
      | 'true'
      | 'false'
    const viewDone = (req.query.viewDone ?? 'false') as 'true' | 'false'

    const hasSortStatus: boolean = [
      viewNeedsAuthor,
      viewNeedsImage,
      viewNeedsApproval,
      viewNeedsAuthorPaid,
      viewDone,
    ].some((viewStatus) => {
      console.log('viewStatus', viewStatus === 'true')
      return viewStatus === 'true'
    })

    const countQuery = SQL`
      SELECT count(*) as total
      FROM cards
    `

    viewSkaters === 'true'
      ? countQuery.append(SQL` WHERE (position = 'F' OR position = 'D')`)
      : countQuery.append(SQL` WHERE (position = 'G')`)

    const statusesToAppend: SQLStatement[] = []

    if (hasSortStatus) {
      countQuery.append(SQL` AND (`)

      if (viewNeedsAuthor === 'true') {
        statusesToAppend.push(SQL` (author_userID IS NULL)`)
      }

      if (viewNeedsImage === 'true') {
        statusesToAppend.push(
          SQL` (author_userID IS NOT NULL AND image_url IS NULL)`
        )
      }

      if (viewNeedsApproval === 'true') {
        statusesToAppend.push(
          SQL` (author_userID IS NOT NULL AND image_url IS NOT NULL AND approved = 0)`
        )
      }

      if (viewNeedsAuthorPaid === 'true') {
        statusesToAppend.push(
          SQL` (author_userID IS NOT NULL AND image_url IS NOT NULL AND approved = 1 AND author_paid = 0)`
        )
      }

      if (viewDone === 'true') {
        statusesToAppend.push(
          SQL` (author_userID IS NOT NULL AND image_url IS NOT NULL AND approved = 1 AND author_paid = 1)`
        )
      }

      statusesToAppend.forEach((statusToAppend, index) => {
        if (index === 0) {
          countQuery.append(statusToAppend)
        } else {
          countQuery.append(SQL` OR `)
          countQuery.append(statusToAppend)
        }
      })

      countQuery.append(SQL`)`)
    }

    const count = await cardsQuery<ListTotal>(countQuery)

    const query: SQLStatement = SQL`
      SELECT cardID,
        teamID,
        playerID,
        author_userID,
        card_rarity,
        sub_type,
        player_name,
        pullable,
        approved,
        image_url,
        position,
        overall,
        skating,
        shooting,
        hands,
        checking,
        defense,
        high_shots,
        low_shots,
        quickness,
        control,
        conditioning,
        season,
        author_paid
      FROM cards
    `

    viewSkaters === 'true'
      ? query.append(SQL` WHERE (position = 'F' OR position = 'D')`)
      : query.append(SQL` WHERE (position = 'G')`)

    if (hasSortStatus) {
      query.append(SQL` AND (`)

      statusesToAppend.forEach((statusToAppend, index) => {
        if (index === 0) {
          query.append(statusToAppend)
        } else {
          query.append(SQL` OR `)
          query.append(statusToAppend)
        }
      })
      query.append(SQL`)`)
    }

    statusesToAppend.forEach((s) => console.log('s', s))

    query.append(SQL` ORDER BY`)
    if (sortColumn === 'player_name') query.append(SQL` player_name`)
    if (sortColumn === 'cardID') query.append(SQL` cardID`)
    if (sortColumn === 'playerID') query.append(SQL` playerID`)
    if (sortColumn === 'teamID') query.append(SQL` teamID`)
    if (sortColumn === 'author_userID') query.append(SQL` author_userID`)
    if (sortColumn === 'pullable') query.append(SQL` pullable`)
    if (sortColumn === 'approved') query.append(SQL` approved`)
    if (sortColumn === 'author_paid') query.append(SQL` author_paid`)
    if (sortColumn === 'season') query.append(SQL` season`)
    if (sortColumn === 'overall') query.append(SQL` overall`)
    if (sortColumn === 'skating') query.append(SQL` skating`)
    if (sortColumn === 'shooting') query.append(SQL` shooting`)
    if (sortColumn === 'hands') query.append(SQL` hands`)
    if (sortColumn === 'checking') query.append(SQL` checking`)
    if (sortColumn === 'defense') query.append(SQL` defense`)
    if (sortColumn === 'high_shots') query.append(SQL` high_shots`)
    if (sortColumn === 'low_shots') query.append(SQL` low_shots`)
    if (sortColumn === 'quickness') query.append(SQL` quickness`)
    if (sortColumn === 'control') query.append(SQL` control`)
    if (sortColumn === 'conditioning') query.append(SQL` conditioning`)
    sortDirection === 'ASC' ? query.append(SQL` ASC`) : query.append(` DESC`)

    if (limit) {
      query.append(SQL` LIMIT ${parseInt(limit)}`)
    }

    if (offset) {
      query.append(SQL` OFFSET ${parseInt(offset)}`)
    }

    console.log('testing query', query)

    const queryResult = await cardsQuery<Card>(query)

    if ('error' in count || 'error' in queryResult) {
      console.error(queryResult)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Server connection failed')
      return
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: { rows: queryResult, total: count[0].total },
    })
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}