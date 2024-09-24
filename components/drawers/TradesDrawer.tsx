import {
  Alert,
  AlertIcon,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  StackDivider,
} from '@chakra-ui/react'
import { TradeCard } from '@components/cards/TradeCard'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse, SortDirection } from '@pages/api/v3'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useState } from 'react'
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

export default function TradesDrawer({
  onClose,
  isOpen,
}: {
  onClose: () => void
  isOpen: boolean
}) {
  const [tradeStatusFilter, setTradeStatusFilter] = useState<TradeStatus>(
    TRADE_STATUS_OPTIONS[1].value
  )
  const [partnerUsername, setPartnerUsername] = useState<string>('')
  const [debouncedUsername] = useDebounce(partnerUsername, 500)

  const { session, loggedIn } = useSession()

  const { payload: loggedInTrades } = query<ListResponse<Trade>>({
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
        },
      }),
    enabled: loggedIn,
  })

  return (
    <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>My Trades</DrawerHeader>
        <DrawerBody>
          <div className="flex flex-row">
            <FormControl className="mx-1">
              <FormLabel>Status</FormLabel>
              <Select
                onChange={(event) =>
                  setTradeStatusFilter(event.target.value as TradeStatus)
                }
              >
                {TRADE_STATUS_OPTIONS.map((option) => (
                  <option
                    selected={option.value === 'PENDING'}
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl className="mx-1">
              <FormLabel>Partner</FormLabel>
              <Input
                placeholder="Partner"
                type="text"
                onChange={(event) => setPartnerUsername(event.target.value)}
              />
            </FormControl>
          </div>
          {debouncedUsername?.length > 0 && debouncedUsername?.length < 3 && (
            <Alert status="info">
              <AlertIcon />
              At least three charaters required to search for a username
            </Alert>
          )}
          <Stack className="mt-2" divider={<StackDivider />}>
            {loggedInTrades?.rows.map((trade) => (
              <TradeCard key={trade.tradeID} trade={trade} />
            ))}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
