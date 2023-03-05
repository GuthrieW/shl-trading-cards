import Button from '@components/buttons/button'
import TradeCard from '@components/card/trade-card'
import SelectUserModal from '@components/modals/select-user-modal'
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

  const [showTradeModal, setShowTradeModal] = useState<boolean>(false)
  const [selectedTrade, setSelectedTrade] = useState<Trade>(null)

  const [showUsersModal, setShowUsersModal] = useState<boolean>(false)

  const handleSelectTrade = (trade: Trade) => {
    setShowTradeModal(true)
    setSelectedTrade(trade)
  }

  const closeTradeModal = () => {
    setShowTradeModal(false)
    setSelectedTrade(null)
  }

  const handleCreateNewTrade = () => {
    setShowUsersModal(true)
  }

  const closeUsersModal = () => {
    setShowUsersModal(false)
  }

  if (usersIsLoading || allCardsIsLoading || userTradesIsLoading) {
    return null
  }

  return (
    <>
      <NextSeo title="Trades" />
      <ScrollableSelect scrollbarTitle="Trades">
        {[...userTrades, ...userTrades].map((trade) => (
          <TradeCard
            key={trade.tradeid}
            onClick={() => {
              handleSelectTrade(trade)
            }}
            trade={trade}
            className={'border-t'}
          />
        ))}
      </ScrollableSelect>
      <div className="w-full h-full ml-64">
        <div className="flex">
          <Button
            onClick={() => {
              handleCreateNewTrade()
            }}
            disabled={false}
            type={'submit'}
          >
            New Trade
          </Button>
        </div>
      </div>
      {showTradeModal && (
        <TradeViewerModal
          userId={uid}
          closeModal={closeTradeModal}
          trade={selectedTrade}
        />
      )}
      {showUsersModal && <SelectUserModal setShowModal={closeUsersModal} />}
    </>
  )
}

export default TradeHub
