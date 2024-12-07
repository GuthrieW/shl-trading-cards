import { NextApiRequest, NextApiResponse } from 'next';
import middleware from '@pages/api/database/middleware';
import Cors from 'cors';
import { GET } from '@constants/http-methods';
import SQL from 'sql-template-strings';
import { StatusCodes } from 'http-status-codes';
import methodNotAllowed from '../../lib/methodNotAllowed';
import { ApiResponse, UserPacks } from '../..';
import { cardsQuery } from '@pages/api/database/database';


const allowedMethods: string[] = [GET];
const cors = Cors({
    methods: allowedMethods,
});

export default async function userPacksEndpoint(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<UserPacks[]>>
): Promise<void> {
    await middleware(req, res, cors);

    if (req.method === GET) {
        const userID = req.query.userID as string;
        const packID = req.query.packID as string;

        if (!userID && !packID) {
            res
                .status(StatusCodes.BAD_REQUEST)
                .json({ status: 'error', message: 'Missing userID or packID' });
            return;
        }

        const query = SQL`
            SELECT packID, userID, packType, opened, purchaseDate, openDate, source
            FROM packs_owned
            WHERE opened = 1
        `;

        if (userID) {
            query.append(SQL` AND userID = ${userID}`);
        }

        if (packID) {
            query.append(SQL` AND packID = ${packID}`);
        }

        query.append(SQL` ORDER BY openDate DESC`);

        if (userID && !packID) {
            query.append(SQL` LIMIT 3`);
        }

        const queryResult = await cardsQuery<UserPacks>(query);

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
                .json({ status: 'error', message: 'No opened packs found for this user' });
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