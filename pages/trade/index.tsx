import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import Autocomplete from '@components/forms/Autocomplete'
import NewTrade from '@components/trades/NewTrade'
import ViewTrades from '@components/trades/ViewTrades'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default () => {
  const { session, loggedIn } = useSession()
  const tradesDrawer = useDisclosure()
  const router = useRouter()

  const [tradePartnerUid, setTradePartnerUid] = useState<number>(null)
  const [cardID, setCardID] = useState<number | null>(null)
  const [resetTradeCards, setResetTradeCards] = useState<boolean>(false)

  const TAB_PATHS = ['new-trade', 'view-trade', 'marketplace']

  const currentTab = router.query.tab as string
  const tabIndex = currentTab ? TAB_PATHS.indexOf(currentTab) : 0

  const { payload: loggedInUser } = query<UserData>({
    queryKey: ['baseUser', session?.token],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/user',
        headers: { Authorization: `Bearer ${session?.token}` },
      }),
    enabled: loggedIn,
  })

  useEffect(() => {
    const { partnerId, cardID } = router.query
    if (partnerId && typeof partnerId === 'string') {
      setTradePartnerUid(parseInt(partnerId))
    } else {
      setTradePartnerUid(null)
    }
    if (cardID && typeof cardID === 'string') {
      setCardID(parseInt(cardID))
    } else {
      setCardID(null)
    }
  }, [router.query])

  const handleResetTradeCards = () => {
    setResetTradeCards(true)
  }

  const handleTabChange = (index: number) => {
    const tab = TAB_PATHS[index]
    router.push(
      {
        pathname: '/trade',
        query: { ...router.query, tab },
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <PageWrapper>
      <Tabs
        isFitted
        variant="enclosed-colored"
        isLazy
        index={tabIndex}
        onChange={handleTabChange}
      >
        <TabList>
          <Tab
            _selected={{
              borderBottomColor: 'blue.600',
            }}
            className="!bg-primary !text-secondary !border-b-4"
          >
            Send Trades
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: 'blue.600',
            }}
            className="!bg-primary !text-secondary !border-b-4"
          >
            Your Trades
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Autocomplete
              label="Trade Partner"
              onSelect={(newValue) => {
                setTradePartnerUid(parseInt(newValue))
                handleResetTradeCards()
              }}
            />
            {loggedInUser && tradePartnerUid && (
              <NewTrade
                loggedInUser={loggedInUser}
                tradePartnerUid={String(tradePartnerUid)}
                cardID={cardID}
                resetTradeCards={resetTradeCards}
                setResetTradeCards={setResetTradeCards}
              />
            )}
          </TabPanel>
          <TabPanel>
            <ViewTrades />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageWrapper>
  )
}
