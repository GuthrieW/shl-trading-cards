import OptionInput from '@components/option-input'
import React, { useEffect, useState } from 'react'
import useAllCards from '@hooks/use-all-cards'
import { stringInCardName } from '@utils/index'
import PageHeader from '@components/page-header'
import styled from 'styled-components'

const TradeHubContainer = styled.div`
  margin-left: 10px;
`

const TradeHub = () => {
  const [searchString, setSearchString] = useState('')
  const [filteredCards, setFilteredCards] = useState([])
  const { cards, isLoading, isError } = useAllCards()

  useEffect(() => {
    const newFilteredCards = []
    for (const card of cards) {
      if (stringInCardName(card, searchString)) {
        newFilteredCards.push(card)
      }
    }
    setFilteredCards(newFilteredCards)
  }, [cards, searchString])

  return (
    <TradeHubContainer>
      <PageHeader>Trade Hub</PageHeader>
      <OptionInput
        options={cards}
        loading={isLoading}
        groupBy={(option) => (option ? option.rarity : '')}
        getOptionLabel={(option) => (option ? option.playerName : '')}
        label={'Enter player name'}
        onInputChange={(event, newInputValue) => {
          setSearchString(newInputValue)
        }}
      />
    </TradeHubContainer>
  )
}

export default TradeHub
