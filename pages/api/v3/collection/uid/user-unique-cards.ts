import { NextApiRequest, NextApiResponse } from 'next';
import middleware from '@pages/api/database/middleware';
import Cors from 'cors';
import { GET } from '@constants/http-methods';
import SQL from 'sql-template-strings';
import { StatusCodes } from 'http-status-codes';
import methodNotAllowed from '../../lib/methodNotAllowed'
import { ApiResponse, UserUniqueCollection } from '../..'
import { cardsQuery } from '@pages/api/database/database'


const allowedMethods: string[] = [GET];
const cors = Cors({
    methods: allowedMethods,
});

export default async function userUniqueCardsEndpoint(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<InternalUserUniqueCollection[] | null>>
): Promise<void> {
    await middleware(req, res, cors);

    if (req.method === GET) {
        const userID = req.query.userID as string;

        if (!userID) {
            res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: 'error', message: 'Missing userID' });
            return;
        }

        const queryResult = await cardsQuery<UserUniqueCollection>(SQL`
      SELECT userID, card_rarity, owned_count
      FROM user_unique_cards
      WHERE userID = ${userID}
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
                .json({ status: 'error', message: 'User does not have any cards' });
            return;
        }

        res.status(StatusCodes.OK).json({
            status: 'success',
            payload: queryResult,
        });
        return;
    }

    methodNotAllowed(req, res, allowedMethods);
}
