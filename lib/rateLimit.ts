import { NextApiRequest, NextApiResponse } from 'next'

interface RequestCount {
  count: number
  lastRequestTime: number
}

const RATE_LIMIT = 50
const WINDOW_SIZE_IN_MS = 60 * 1000
const PACK_WINDOW_SIZE_IN_MS = 30 * 1000
const requestMap = new Map<string, RequestCount>()

const getKey = (req: NextApiRequest): [string, boolean] => {
  const ip = (req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress) as string
  const url = req.url ?? ''

  const isPackPurchase = Boolean(req.url?.includes('/packs/buy'))

  return [
    `${ip?.split(',')[0]}-${url}${
      isPackPurchase ? `-${req?.query?.packType}` : ''
    }`,
    isPackPurchase,
  ]
}

export const rateLimit = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const [key, isPackPurchase] = getKey(req)
    const getPackRateLimit = (packType: string) => (packType === 'ruby' ? 1 : 3)

    const rateLimit = isPackPurchase
      ? getPackRateLimit(req?.query?.packType as string)
      : RATE_LIMIT
    const windowSize = isPackPurchase
      ? PACK_WINDOW_SIZE_IN_MS
      : WINDOW_SIZE_IN_MS

    const currentTime = Date.now()
    let requestData = requestMap.get(key)

    if (!requestData) {
      requestData = { count: 0, lastRequestTime: currentTime }
      requestMap.set(key, requestData)
    }

    if (currentTime - requestData.lastRequestTime < windowSize) {
      if (requestData.count >= rateLimit) {
        res.status(429).end('Rate limit exceeded')
        return
      }
      requestData.count += 1
    } else {
      requestData.count = 1
      requestData.lastRequestTime = currentTime
    }

    return handler(req, res)
  }
}
