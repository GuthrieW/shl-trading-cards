import TradeViewerCard from '@components/cards/trade-viewer-card'
import CardSearchForm from '@components/forms/card-search-form'
import SelectUserModal from '@components/modals/select-user-modal'
import NewTradeSelectorOption from '@components/selectors/new-trade-selector-option'
import ScrollableSelect from '@components/selectors/scrollable-select'
import TradeSelectFilters from '@components/selectors/trade-select-filters'
import TradeSelectorOption from '@components/selectors/trade-selector-option'
import { useResponsive } from '@hooks/useResponsive'
import useGetUserTrades from '@pages/api/queries/use-get-user-trades'
import getUidFromSession from '@utils/get-uid-from-session'
import { NextSeo } from 'next-seo'
import React, { useMemo, useState } from 'react'

const TradeHub = () => {
  const [showTrade, setShowTrade] = useState<boolean>(false)
  const [selectedTrade, setSelectedTrade] = useState<Trade>(null)
  const [showUsersModal, setShowUsersModal] = useState<boolean>(false)
  const [selectedStatuses, setSelectedStatuses] = useState<TradeStatus[]>([])
  const [isFiltering, setIsFiltering] = useState<boolean>(true)
  // const [searchString, setSearchString] = useState<string>('')

  const { isMobile, isTablet } = useResponsive()

  const uid: number = getUidFromSession()
  const { userTrades, isLoading: userTradesIsLoading } = useGetUserTrades({
    uid,
  })

  const trades: Trade[] = useMemo(() => {
    let filteredTrades = userTrades
    if (selectedStatuses.length !== 0) {
      filteredTrades = filteredTrades.filter((trade) =>
        selectedStatuses.includes(trade.trade_status)
      )
    }

    filteredTrades = filteredTrades.sort(
      (a: Trade, b: Trade) =>
        Number(new Date(b.update_date)) - Number(new Date(a.update_date))
    )

    setIsFiltering(false)
    console.log('done filtering')
    return filteredTrades
  }, [userTradesIsLoading, selectedStatuses])
  // }, [userTrades, searchString, selectedStatuses])

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

  return (
    <div className="h-full w-full">
      <NextSeo title="Trades" />
      <ScrollableSelect scrollbarTitle="Trades">
        <TradeSelectFilters
          key={'select-filters'}
          statuses={selectedStatuses}
          updateStatuses={(statuses) => {
            setIsFiltering(true)
            setSelectedStatuses(statuses)
          }}
          // username={searchString}
          // updateUsername={setSearchString}
          disabled={isFiltering}
        />
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
      <div
        className={`h-full absolute right-0 ${
          isMobile || isTablet ? 'left-32' : 'left-64'
        }`}
      >
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
    </div>
  )
}

export default TradeHub
