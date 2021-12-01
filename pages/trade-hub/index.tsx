import OptionInput from '@components/option-input'
import React, { useEffect, useState } from 'react'
import cards from '@utils/test-data/cards.json'
import useAllCards from '@hooks/use-all-cards'
import { stringInCardName } from '@utils/index'

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
