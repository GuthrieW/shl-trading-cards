import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Drawer,
  DrawerBody,
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
} from '@chakra-ui/react'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse, SortDirection } from '@pages/api/v3'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useState } from 'react'

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

export default async function TradesDrawer() {
  const [tradeStatusFilter, setTradeStatusFilter] = useState<string[]>([])
  const [partnerUsername, setPartnerUsername] = useState<string>(null)

  const { session, loggedIn } = useSession()

  const { payload: loggedIntrades, isLoading: loggedInTradesIsLoading } = query<
    ListResponse<Trade>
  >({
    queryKey: ['trades', session?.token],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/trades`,
        params: {
          headers: { Authorization: `Bearer ${session?.token}` },
        },
      }),
    enabled: loggedIn,
  })

  const toggleStatus = (statusToToggle: TradeStatus) => {
    if (tradeStatusFilter.includes(status)) {
      setTradeStatusFilter([...tradeStatusFilter, statusToToggle])
    } else {
      setTradeStatusFilter(
        tradeStatusFilter.filter(
          (status: TradeStatus) => status !== statusToToggle
        )
      )
    }
  }

  // Current Trades
  // 1. Filtering by tradeStatus, tradePartnerName
  // 2. Sorting by tradePartnerName, tradeDate
  return (
    <Drawer placement="left" isOpen={true} onClose={null}>
      <DrawerContent>
        <DrawerHeader>Trades</DrawerHeader>
        <DrawerBody>
          <div className="flex flex-row">
            <FormControl>
              <Menu>
                <MenuButton>Status</MenuButton>
                <MenuList>
                  <MenuOptionGroup type="checkbox">
                    {TRADE_STATUS_OPTIONS.map((option) => (
                      <MenuItemOption
                        onClick={() => toggleStatus(option.value)}
                        key={option.value}
                        value={`${option.value}`}
                      >
                        {option.label}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </FormControl>
            <FormControl>
              <FormLabel>Partner</FormLabel>
              <Input
                placeholder="Partner"
                type="text"
                onChange={(event) => setPartnerUsername(event.target.value)}
              />
            </FormControl>
          </div>
          <div className="flex flex--col">
            {!loggedInTradesIsLoading &&
              loggedIntrades.rows.map((trade) => (
                <Card>
                  <CardHeader>
                    #{trade.tradeid} - {trade.recipientid}
                  </CardHeader>
                  <CardBody>
                    Status: {trade.trade_status}
                    <br />
                    Date: {trade.create_date.toDateString()}
                  </CardBody>
                </Card>
              ))}
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
