import React, { useState } from 'react'
import { PageHeader, TradeHubSidebar } from '@components/index'
import { tradeHubPages } from '@constants/index'
import styled from 'styled-components'
import { Box } from '@mui/material'
import CardSearch from './card-search'
import CreateTrade from './create-trade'
import ViewTrades from './view-trades'

const HorizontalBox = styled(Box)`
  display: flex;
  flex-direction: row;
`

const VerticalSelectionBox = styled(Box)`
  display: flex;
  flex-direction: column;
`

const VerticalContentBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

type SelectedTradeHubPage =
  | 'none'
  | 'card-search'
  | 'create-trade'
  | 'view-trades'

const TradeHub = () => {
  const [selectedTradeHugePage, setSelectedTradeHubPage] =
    useState<SelectedTradeHubPage>('none')

  return (
    <>
      <PageHeader>Trade Hub</PageHeader>
      <HorizontalBox>
        <VerticalSelectionBox>
          <TradeHubSidebar
            pages={tradeHubPages}
            onItemClick={setSelectedTradeHubPage}
            selectedItem={selectedTradeHugePage}
          />
        </VerticalSelectionBox>
        <VerticalContentBox>
          {selectedTradeHugePage === 'card-search' && <CardSearch />}
          {selectedTradeHugePage === 'create-trade' && <CreateTrade />}
          {selectedTradeHugePage === 'view-trades' && <ViewTrades />}
        </VerticalContentBox>
      </HorizontalBox>
    </>
  )
}

export default TradeHub
