import TradeCard from '@components/card/trade-card'
import NewTradeCard from '@components/card/trade-card/new-trade-card'
import TradeViewerCard from '@components/card/trade-viewer-card'
import CardSearchForm from '@components/forms/card-search-form'
import SelectUserModal from '@components/modals/select-user-modal'
import ScrollableSelect from '@components/selectors/scrollable-select'
import useGetUserTrades from '@pages/api/queries/use-get-user-trades'
import getUidFromSession from '@utils/get-uid-from-session'
import { NextSeo } from 'next-seo'
import React, { useState } from 'react'

const TradeHub = () => {
  const uid = getUidFromSession()
  const {
    userTrades,
    isLoading: userTradesIsLoading,
    isError: userTradesIsError,
  } = useGetUserTrades({ uid })

  const [showTrade, setShowTrade] = useState<boolean>(false)
  const [selectedTrade, setSelectedTrade] = useState<Trade>(null)

  const [showUsersModal, setShowUsersModal] = useState<boolean>(false)

  const handleSelectTrade = (trade: Trade) => {
    if (selectedTrade?.tradeid === trade?.tradeid) {
      setShowTrade(false)
      setSelectedTrade(null)
    } else {
      setShowTrade(true)
      setSelectedTrade(trade)
    }
  }

  const closeTrade = () => {
    setShowTrade(false)
    setSelectedTrade(null)
  }

  const handleCreateNewTrade = () => {
    setShowUsersModal(true)
  }

  const closeUsersModal = () => {
    setShowUsersModal(false)
  }

  if (userTradesIsLoading) {
    return null
  }

  return (
    <>
      <NextSeo title="Trades" />
      <ScrollableSelect scrollbarTitle="Trades">
        <NewTradeCard
          className="cursor-pointer"
          key={'new-trade'}
          onClick={handleCreateNewTrade}
          trade={{
            tradeid: null,
            initiatorid: null,
            recipientid: null,
            trade_status: 'PENDING',
            update_date: null,
            create_date: null,
          }}
        />
        <>
          {[...userTrades, ...userTrades].map((trade) => (
            <TradeCard
              key={trade.tradeid}
              onClick={() => {
                handleSelectTrade(trade)
              }}
              trade={trade}
              className="border-t cursor-pointer"
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
