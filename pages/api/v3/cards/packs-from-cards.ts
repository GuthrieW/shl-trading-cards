import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse, ListResponse, ListTotal, SortDirection, UserCollection } from '..'
import middleware from '@pages/api/database/middleware'
import Cors from 'cors'
import { GET, PATCH } from '@constants/http-methods'
import { cardsQuery } from '@pages/api/database/database'
import SQL, { SQLStatement } from 'sql-template-strings'
import { StatusCodes } from 'http-status-codes'
import methodNotAllowed from '../lib/methodNotAllowed'

const allowedMethods: string[] = [GET];
const cors = Cors({
    methods: allowedMethods,
});

export default async function userUniqueCardsEndpoint(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<UserCollection[] | null>>
): Promise<void> {
    await middleware(req, res, cors);

    if (req.method === GET) {
        const userID = req.query.userID as string;
        const cardID = req.query.cardID as string;

        if (!userID) {
            res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: 'error', message: 'Missing userID or cardID' });
            return;
        }

        const queryResult = await cardsQuery<UserCollection>(SQL`
      SELECT ownedCardID, userID, cardID, packID
      FROM collection
      WHERE userID = ${userID} and cardID = ${cardID}
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
                .json({ status: 'error', message: 'Something went wrong here' });
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

