import { NextApiRequest, NextApiResponse } from 'next';
import middleware from '@pages/api/database/middleware';
import Cors from 'cors';
import { GET } from '@constants/http-methods';
import SQL from 'sql-template-strings';
import { StatusCodes } from 'http-status-codes';
import methodNotAllowed from '../lib/methodNotAllowed';
import { ApiResponse, SiteUniqueCards } from '..';
import { cardsQuery } from '@pages/api/database/database';

const allowedMethods: string[] = [GET];
const cors = Cors({
  methods: allowedMethods,
});

export default async function uniqueCardsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SiteUniqueCards[] | null>> // Expecting an array of SiteUniqueCards or null
): Promise<void> {
  await middleware(req, res, cors);

  if (req.method === GET) {
    const queryResult = await cardsQuery<SiteUniqueCards>(SQL`
      SELECT card_rarity, total_count
      FROM unique_cards
    `);

    if ('error' in queryResult) {
      console.error(queryResult.error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('Database connection failed');
      return;
    }

    if (queryResult.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: 'error', message: 'No unique cards found' });
      return;
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      payload: queryResult, // Returning array of unique cards
    });
    return;
  }

  methodNotAllowed(req, res, allowedMethods);
}