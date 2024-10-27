import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, ListResponse } from '../../';
import middleware from '@pages/api/database/middleware';
import Cors from 'cors';
import { DELETE } from '@constants/http-methods';
import { cardsQuery } from '@pages/api/database/database';
import SQL from 'sql-template-strings';
import { checkUserAuthorization } from '../../lib/checkUserAuthorization';
import { StatusCodes } from 'http-status-codes';
import methodNotAllowed from '../../lib/methodNotAllowed';

const allowedMethods: string[] = [DELETE] as const;
const cors = Cors({
  methods: allowedMethods,
});

export default async function delete_binder(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<Trade | null>>>
): Promise<void> {
  await middleware(req, res, cors);
  const bid = req.query.bid  as string

  if (req.method === DELETE) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'error',
          message: 'Missing or invalid authorization token',
          payload: null,
        });
        return;
      }

      if (!bid) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          message: 'Missing required fields binderID',
          payload: null,
        });
        return;
      }

      await cardsQuery(
        SQL`delete from binder_cards where binderID=${bid}`
      );
      await cardsQuery(
        SQL`delete from binders where binderID=${bid}`
      );

      res.status(StatusCodes.OK).json({
        status: 'success',
        payload: null,
      });
      return;
    } catch (error) {
      console.error('Error deleting binder:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to delete binder',
        payload: null,
      });
      return;
    }
  }

  methodNotAllowed(req, res, allowedMethods);
}