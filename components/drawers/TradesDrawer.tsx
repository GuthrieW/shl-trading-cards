import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertIcon,
  Button,
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
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Select,
  Stack,
  StackDivider,
} from '@chakra-ui/react'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse, SortDirection } from '@pages/api/v3'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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
  const router = useRouter()

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
            {loggedInTrades?.rows.map((trade, index) => {
              const otherUserId =
                trade.initiatorID === parseInt(session.userId)
                  ? trade.recipientID
                  : trade.initiatorID
              return (
                <Card
                  className="cursor-pointer hover:bg-primaryDark transition-colors"
                  key={trade?.tradeID}
                  onClick={() => router.push(`/trades/${trade.tradeID}`)}
                >
                  <CardHeader>
                    #{trade?.tradeID} - {otherUserId}
                  </CardHeader>
                  <CardBody>Status: {trade?.trade_status}</CardBody>
                </Card>
              )
            })}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
