import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAllCards, useCardOwners } from '@hooks/index'
import { stringInCardName } from '@utils/index'
import { DataTable, OptionInput, PageHeader } from '@components/index'
import Router from 'next/router'

const TradeHubContainer = styled.div`
  margin-left: 10px;
`

const columns = [
  {
    label: 'Name',
    name: 'username',
  },
]

const options = {
  onRowClick: (rowData) => {
    Router.push({
      pathname: 'trade-hub/create-trade',
      query: { username: rowData[0] },
    })
  },
}
const TradeHub = () => {
  const [searchString, setSearchString] = useState<string>('')
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [filteringCards, setFilteringCards] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<Card>(null)
  const {
    allCards,
    isLoading: allCardsIsLoading,
    isError: allCardsIsError,
  } = useAllCards()
  const {
    cardOwners,
    isLoading: cardOwnersIsLoading,
    isError: cardOwnersIsError,
  } = useCardOwners()

  useEffect(() => {
    setFilteringCards(true)
    let newFilteredCards = []

    if (searchString !== '') {
      const cardsIncludingString = allCards.filter((card) => {
        return stringInCardName(card, searchString)
      })

      const matchingCards = cardsIncludingString.filter((card) => {
        return card.playerName === searchString
      })

      matchingCards.length === 1
        ? setSelectedCard(matchingCards[0])
        : setSelectedCard(null)

      newFilteredCards = cardsIncludingString
    } else {
      setSelectedCard(null)
      newFilteredCards = allCards
    }

    setFilteredCards(newFilteredCards)
    setFilteringCards(false)
  }, [allCards, searchString])

  return (
    <TradeHubContainer>
      <PageHeader>Trade Hub</PageHeader>
      <OptionInput
        options={allCards}
        loading={allCardsIsLoading}
        groupBy={(option) => (option ? option.rarity : '')}
        getOptionLabel={(option) => (option ? option.playerName : '')}
        label={'Enter player name'}
        onInputChange={(event, newInputValue) => {
          setSearchString(newInputValue)
        }}
      />
      {selectedCard && (
        <DataTable
          title={`Owners of ${selectedCard.playerName}`}
          data={cardOwners}
          columns={columns}
          options={options}
        />
      )}
    </TradeHubContainer>
  )
}

export default TradeHub
