import TradeCard from '@components/card/trade-card'
import TradeViewerModal from '@components/modals/trade-viewer-modal'
import ScrollableSelect from '@components/selectors/scrollable-select'
import { NextSeo } from 'next-seo'
import React, { useState } from 'react'

const Trades = () => {
  // const { trades, isLoading, isError } = useGetTrades({})
  const firstTrade: Trade = {
    tradeID: 1,
    tradeAssetID: 1,
    fromID: 2856,
    toID: 2554,
    cardID: 3692,
    trade_status: 'pending',
    create_date: new Date(),
    update_date: new Date(),
  }
  const trades = [firstTrade]
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedTrade, setSelectedTrade] = useState<Trade>(null)

  const handleOptionClick = (trade) => {
    setSelectedTrade(trade)
    setShowModal(true)
  }

  return (
    <>
      <NextSeo title="Trades" />
      <ScrollableSelect scrollbarTitle="Trades">
        {trades.map((trade) => (
          <TradeCard onClick={handleOptionClick} trade={trade} />
        ))}
      </ScrollableSelect>
      {showModal && (
        <TradeViewerModal setShowModal={setShowModal} trade={selectedTrade} />
      )}
    </>
  )
}

export default Trades
