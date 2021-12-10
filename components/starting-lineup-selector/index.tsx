import React, { useState, useEffect } from 'react'
import { OptionInput } from '@components/index'
import sortBy from 'lodash/sortBy'
import stringInCardName from '@utils/string-in-card-name'
import { Box } from '@material-ui/core'

type StartingLineupSelectorProps = {
  headerText: string
  selectedCard: Card
  ownedCards: Card[]
  ownedCardsLoading: boolean
  otherSelectedCards: Card[]
  onCardChange: any
}

const StartingLineupSelector = ({
  headerText,
  selectedCard,
  ownedCards,
  ownedCardsLoading,
  otherSelectedCards,
  onCardChange,
}: StartingLineupSelectorProps) => {
  const [searchString, setSearchString] = useState<string>('')
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [filteringCards, setFilteringCards] = useState<boolean>(false)

  useEffect(() => {
    setFilteringCards(true)
    let newFilteredCards = []

    if (searchString !== '') {
      const cardsIncludingString = ownedCards.filter((card: Card) => {
        return stringInCardName(card, searchString)
      })

      const matchingCards = cardsIncludingString.filter((card: Card) => {
        return card.player_name === searchString
      })

      newFilteredCards = matchingCards
    } else {
      newFilteredCards = ownedCards
    }

    const otherSelectedCardNames = otherSelectedCards.map(
      (otherSelectedCard: Card) => {
        return otherSelectedCard?.player_name
      }
    )

    const removedAlreadySelectedCards = newFilteredCards.filter(
      (matchingCard: Card) => {
        return !otherSelectedCardNames.includes(matchingCard.player_name)
      }
    )

    const sortedCards = sortBy(removedAlreadySelectedCards, (card: Card) => {
      return [card.card_rarity, card.player_name]
    })
    setFilteredCards(sortedCards)
  }, [ownedCards, searchString, otherSelectedCards])

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h3>{headerText}</h3>
      {selectedCard && (
        <img src={selectedCard.image_url} style={{ width: '75%' }} />
      )}
      <OptionInput
        options={filteredCards}
        loading={ownedCardsLoading || filteringCards}
        groupBy={(option: Card) => (option ? option.card_rarity : '')}
        getOptionLabel={(option: Card) => (option ? option.player_name : '')}
        label={'Enter claimed card name'}
        onChange={(event, newValue) => {
          onCardChange(newValue)
        }}
        onInputChange={(event, newInputValue) => {
          setSearchString(newInputValue)
        }}
      />
    </Box>
  )
}

export default StartingLineupSelector
