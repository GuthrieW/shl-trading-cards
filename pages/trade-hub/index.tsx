import OptionInput from '@components/option-input'
import React, { useEffect, useState } from 'react'
import useAllCards from '@hooks/use-all-cards'
import { stringInCardName } from '@utils/index'
import PageHeader from '@components/page-header'

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
    <div>
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
    </div>
  )
}

export default TradeHub
