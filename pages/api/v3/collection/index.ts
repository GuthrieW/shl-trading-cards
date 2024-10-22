import { NextApiRequest, NextApiResponse } from 'next'
import methodNotAllowed from '../lib/methodNotAllowed'
import { ApiResponse, ListResponse } from '..'

export default async function allCollectionsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListResponse<null>>>
): Promise<void> {
  methodNotAllowed(req, res, [])
}
