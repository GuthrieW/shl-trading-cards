import TradeCard from '@components/card/trade-card'
import TradeViewerModal from '@components/modals/trade-viewer-modal'
import ScrollableSelect from '@components/selectors/scrollable-select'
import { useGetAllCards, useGetAllUsers } from '@pages/api/queries'
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
  const {
    users,
    isLoading: usersIsLoading,
    isError: usersIsError,
  } = useGetAllUsers({})
  const {
    allCards,
    isLoading: allCardsIsLoading,
    isError: allCardsIsError,
  } = useGetAllCards({})

  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedTrade, setSelectedTrade] = useState<Trade>(null)

  const handleOptionClick = (trade: Trade) => {
    setSelectedTrade(trade)
    setShowModal(true)
  }

  if (usersIsLoading || allCardsIsLoading || userTradesIsLoading) {
    return null
  }

  return (
    <>
      <NextSeo title="Trades" />
      <ScrollableSelect scrollbarTitle="Trades">
        {userTrades.map((trade) => (
          <TradeCard
            key={trade.tradeID}
            onClick={handleOptionClick}
            trade={trade}
            className={'border-t'}
          />
        ))}
      </ScrollableSelect>
      <div></div>
      {showModal && (
        <TradeViewerModal
          userId={uid}
          setShowModal={setShowModal}
          trade={selectedTrade}
        />
      )}
    </>
  )
}

export default TradeHub
