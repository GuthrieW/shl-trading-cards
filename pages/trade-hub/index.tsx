import OptionInput from '@components/option-input'
import React, { useEffect, useState } from 'react'
import useAllCards from '@hooks/use-approved-cards'
import { stringInCardName } from '@utils/index'
import PageHeader from '@components/page-header'
import styled from 'styled-components'

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
