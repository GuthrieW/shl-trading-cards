import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import ViewTradeTable from '@components/tables/ViewTradeTable'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse, SortDirection } from '@pages/api/v3'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDebounce } from 'use-debounce'

const TRADE_STATUS_OPTIONS: {
  value: TradeStatus
  label: string
  sortLabel: (direciton: SortDirection) => string
}[] = [
  {
    value: 'COMPLETE',
    label: 'Complete',
    sortLabel: (direction: SortDirection) =>
      direction === 'DESC' ? '(Descending)' : '(Ascending)',
  },
  {
    value: 'PENDING',
    label: 'Pending',
    sortLabel: (direction: SortDirection) =>
      direction === 'DESC' ? '(Descending)' : '(Ascending)',
  },
  {
    value: 'DECLINED',
    label: 'Declined',
    sortLabel: (direction: SortDirection) =>
      direction === 'DESC' ? '(Descending)' : '(Ascending)',
  },
  {
    value: 'AUTO_DECLINED',
    label: 'Auto Declined',
    sortLabel: (direction: SortDirection) =>
      direction === 'DESC' ? '(Descending)' : '(Ascending)',
  },
] as const

export default function ViewTrades() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialStatus = (searchParams.get('status') as TradeStatus) ?? 'PENDING'
  const [tradeStatusFilter, setTradeStatusFilter] =
    useState<TradeStatus>(initialStatus)

  const [partnerUsername, setPartnerUsername] = useState<string>('')
  const [debouncedUsername] = useDebounce(partnerUsername, 500)
  const { session, loggedIn } = useSession()
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setStatusCallback = useCallback(
    (value: TradeStatus) => {
      router.push(`/trade?${createQueryString('status', value)}`)
      setTradeStatusFilter(value)
    },
    [router, createQueryString]
  )

  const { payload: loggedInTrades, isLoading } = query<ListResponse<Trade>>({
    queryKey: [
      'trades',
      session?.token,
      JSON.stringify(tradeStatusFilter),
      debouncedUsername,
    ],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/trades`,
        headers: { Authorization: `Bearer ${session?.token}` },
        params: {
          username: debouncedUsername?.length >= 3 ? debouncedUsername : '',
          status: tradeStatusFilter,
          userID: session.userId,
        },
      }),
    enabled: loggedIn,
  })

  return (
    <>
      <div className="border-b-8 border-b-blue700 bg-secondary p-4">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
        >
          <Heading as="h1" size="md" color="secondaryText" flexShrink={0}>
            View Your Trades
          </Heading>

          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} flex="1">
            <FormControl>
              <FormLabel>Status</FormLabel>
              <RadioGroup
                value={tradeStatusFilter}
                onChange={(value) => setStatusCallback(value as TradeStatus)}
              >
                <Stack direction={{ base: 'column', md: 'row' }}>
                  {TRADE_STATUS_OPTIONS.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Partner</FormLabel>
              <Input
                placeholder="Partner username"
                type="text"
                value={partnerUsername}
                onChange={(e) => setPartnerUsername(e.target.value)}
                className="bg-secondary text-primary"
              />
            </FormControl>
          </Stack>
        </Stack>
      </div>

      <ViewTradeTable trades={loggedInTrades?.rows} isLoading={isLoading} />
    </>
  )
}
