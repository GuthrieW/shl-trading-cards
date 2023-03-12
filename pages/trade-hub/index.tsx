import Button from '@components/buttons/button'
import TradeCard from '@components/card/trade-card'
import TradeViewerCard from '@components/card/trade-viewer-card'
import SelectUserModal from '@components/modals/select-user-modal'
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

  const [showTrade, setShowTrade] = useState<boolean>(false)
  const [selectedTrade, setSelectedTrade] = useState<Trade>(null)

  const [showUsersModal, setShowUsersModal] = useState<boolean>(false)

  const handleSelectTrade = (trade: Trade) => {
    if (selectedTrade?.tradeid === trade?.tradeid) {
      setShowTrade(false)
      setSelectedTrade(null)
      console.log('setting to true')
    } else {
      console.log('setting to false')
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
      <div className="h-full absolute left-64 right-0">
        {showTrade ? (
          <TradeViewerCard
            userId={uid}
            closeTrade={closeTrade}
            trade={selectedTrade}
          />
        ) : (
          <div className="h-full flex justify-center items-center">
            <Button
              type="button"
              disabled={showUsersModal}
              onClick={handleCreateNewTrade}
            >
              New Trade
            </Button>
          </div>
        )}
      </div>
      {showUsersModal && <SelectUserModal setShowModal={closeUsersModal} />}
    </>
  )
}

export default TradeHub
