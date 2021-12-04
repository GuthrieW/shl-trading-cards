import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAllCards } from '@hooks/index'
import { stringInCardName } from '@utils/index'
import { OptionInput, PageHeader } from '@components/index'

const TradeHubContainer = styled.div`
  margin-left: 10px;
`

const TradeHub = () => {
  const [searchString, setSearchString] = useState<string>('')
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<Card>(null)
  const { allCards, isLoading, isError } = useAllCards()

  useEffect(() => {
    const newFilteredCards = []
    for (const card of allCards) {
      if (stringInCardName(card, searchString)) {
        newFilteredCards.push(card)
      }
    }
    setFilteredCards(newFilteredCards)
  }, [allCards, searchString])

  return (
    <TradeHubContainer>
      <PageHeader>Trade Hub</PageHeader>
      <OptionInput
        options={allCards}
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
