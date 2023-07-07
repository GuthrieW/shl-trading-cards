import TradeViewerCard from '@components/cards/trade-viewer-card'
import CardSearchForm from '@components/forms/card-search-form'
import SelectUserModal from '@components/modals/select-user-modal'
import NewTradeSelectorOption from '@components/selectors/new-trade-selector-option'
import ScrollableSelect from '@components/selectors/scrollable-select'
import TradeSelectorOption from '@components/selectors/trade-selector-option'
import useGetUserTrades from '@pages/api/queries/use-get-user-trades'
import getUidFromSession from '@utils/get-uid-from-session'
import { NextSeo } from 'next-seo'
import React, { useMemo, useState } from 'react'

const TradeHub = () => {
  const [showTrade, setShowTrade] = useState<boolean>(false)
  const [selectedTrade, setSelectedTrade] = useState<Trade>(null)
  const [showUsersModal, setShowUsersModal] = useState<boolean>(false)

  const uid: number = getUidFromSession()
  const { userTrades, isLoading: userTradesIsLoading } = useGetUserTrades({
    uid,
  })

  const trades: Trade[] = useMemo(
    () =>
      userTrades.sort(
        (a: Trade, b: Trade) =>
          Number(new Date(b.update_date)) - Number(new Date(a.update_date))
      ),
    [userTrades]
  )

  const handleSelectTrade = (trade: Trade): void => {
    if (selectedTrade?.tradeid === trade?.tradeid) {
      setShowTrade(false)
      setSelectedTrade(null)
    } else {
      setShowTrade(true)
      setSelectedTrade(trade)
    }
  }

  const closeTrade = (): void => {
    setShowTrade(false)
    setSelectedTrade(null)
  }

  const handleCreateNewTrade = (): void => setShowUsersModal(true)
  const closeUsersModal = (): void => setShowUsersModal(false)

  if (userTradesIsLoading) {
    return null
  }

  return (
    <>
      <NextSeo title="Trades" />
      <ScrollableSelect scrollbarTitle="Trades">
        <NewTradeSelectorOption
          className="cursor-pointer border-t-1 border-neutral-400"
          key={'new-trade'}
          onClick={handleCreateNewTrade}
          trade={{
            tradeid: null,
            initiatorid: null,
            recipientid: null,
            trade_status: 'PENDING',
            update_date: null,
            create_date: null,
            declineUserID: null,
          }}
        />
        <>
          {trades.map((trade) => (
            <TradeSelectorOption
              key={trade.tradeid}
              onClick={() => {
                handleSelectTrade(trade)
              }}
              trade={trade}
            />
          ))}
        </>
      </ScrollableSelect>
      <div className="h-full absolute left-64 right-0">
        {showTrade ? (
          <TradeViewerCard
            userId={uid}
            closeTrade={closeTrade}
            trade={selectedTrade}
          />
        ) : (
          <CardSearchForm />
        )}
      </div>
      {showUsersModal && <SelectUserModal setShowModal={closeUsersModal} />}
    </>
  )
}

export default TradeHub
