import {
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
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
import GetUsername from '@components/common/GetUsername'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse, SortDirection } from '@pages/api/v3'
import { formatDateTime } from '@utils/formatDateTime'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
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

  const router = useRouter()
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
      <DrawerContent overflowY="scroll">
        <DrawerCloseButton />
        <DrawerHeader className="bg-secondary">My Trades</DrawerHeader>
        <DrawerBody className="bg-secondary">
          <div className="flex flex-row bg-secondary">
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
                    className="!bg-secondary"
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
            <Alert className="text-black" status="info">
              <AlertIcon />
              At least three charaters required to search for a username
            </Alert>
          )}
          <Stack className="mt-2" divider={<StackDivider />}>
            {/* {loggedInTrades?.rows.map((trade) => (
               <TradeCard key={trade.tradeID} trade={trade} />
             ))} */}
            {loggedInTrades?.rows.map((trade, index) => {
              const otherUserId =
                trade.initiatorID === parseInt(session.userId)
                  ? trade.recipientID
                  : trade.initiatorID
              return (
                <Card
                  key={trade?.tradeID}
                  onClick={() => router.push(`/trade/${trade.tradeID}`)}
                  className="cursor-pointer !border !border-primary hover:scale-105 hover:shadow-xl transition-transform transform duration-300 ease-in-out rounded-lg overflow-hidden"
                >
                  <CardHeader className="bg-secondary text-primary p-4 flex justify-between items-center">
                    <div className="text-lg font-semibold">
                      {trade.initiatorID === parseInt(session.userId)
                        ? 'Sent'
                        : 'Received'}
                    </div>
                    <div className="text-sm text-primary">
                      {formatDateTime(trade?.create_date)}
                    </div>
                  </CardHeader>
                  <CardBody className="bg-secondary text-primary p-4">
                    <div className="text-base font-medium">
                      User:{' '}
                      <span className="font-semibold text-highlight">
                        <GetUsername userID={otherUserId} />
                      </span>
                    </div>
                  </CardBody>
                  <CardBody className="bg-secondary text-primary p-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold`}
                      >
                        {trade?.trade_status}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
