import OptionInput from '@components/option-input'
import React, { useState } from 'react'
import cards from '@utils/test-data/cards.json'

const TradeHub = () => {
  const [searchString, setSearchString] = useState('')
  const [allCards, setAllCards] = useState(cards.data)
  const [cardsLoading, setCardsLoading] = useState(true)

  return (
    <div>
      <OptionInput
        options={allCards}
        loading={cardsLoading}
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
