import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGetAllCards, useGetCardOwners } from '@pages/api/queries/index'
import { stringInCardName } from '@utils/index'
import { DataTable, OptionInput, PageHeader } from '@components/index'
import Router from 'next/router'
import sortBy from 'lodash/sortBy'
import { Paper } from '@material-ui/core'

const TradeHubContainer = styled(Paper)`
  margin-left: 10px;
`

const columns = [
  {
    label: 'Username',
    name: 'username',
  },
]

const CardSearch = () => {
  const [searchString, setSearchString] = useState<string>('')
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [filteringCards, setFilteringCards] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<Card>(null)
  const {
    allCards,
    isLoading: allCardsIsLoading,
    isError: allCardsIsError,
  } = useGetAllCards()
  const {
    cardOwners,
    isLoading: cardOwnersIsLoading,
    isError: cardOwnersIsError,
  } = useGetCardOwners()

  useEffect(() => {
    setFilteringCards(true)
    let newFilteredCards = []

    if (searchString !== '') {
      const cardsIncludingString = allCards.filter((card) => {
        return stringInCardName(card, searchString)
      })

      const matchingCards = cardsIncludingString.filter((card) => {
        return card.player_name === searchString
      })

      matchingCards.length === 1
        ? setSelectedCard(matchingCards[0])
        : setSelectedCard(null)

      newFilteredCards = cardsIncludingString
    } else {
      setSelectedCard(null)
      newFilteredCards = allCards
    }

    const sortedCards = sortBy(newFilteredCards, (card) => {
      return [card.rarity, card.playerName]
    })

    setFilteredCards(sortedCards)
    setFilteringCards(false)
  }, [allCards, searchString])

  return (
    <TradeHubContainer>
      <PageHeader>Card Search</PageHeader>
      <OptionInput
        options={filteredCards}
        loading={allCardsIsLoading}
        groupBy={(option: Card) => (option ? option.card_rarity : '')}
        getOptionLabel={(option: Card) => (option ? option.player_name : '')}
        label={'Enter player name'}
        onInputChange={(event, newInputValue) => {
          setSearchString(newInputValue)
        }}
      />
      {selectedCard && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <div style={{ width: '50%' }}>
            <DataTable
              title={`Owners of ${selectedCard.player_name}`}
              data={cardOwners}
              columns={columns}
              options={{}}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
            }}
          >
            <img width={300} height={400} src={selectedCard.image_url} />
          </div>
        </div>
      )}
    </TradeHubContainer>
  )
}

export default CardSearch
