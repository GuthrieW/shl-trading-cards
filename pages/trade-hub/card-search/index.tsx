import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGetApprovedCards, useGetCardOwners } from '@pages/api/queries/index'
import { stringInCardName } from '@utils/index'
import { DataTable, OptionInput, PageHeader } from '@components/index'
import sortBy from 'lodash/sortBy'
import { pathToCards } from '@constants/index'

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
    approvedCards,
    isLoading: allCardsIsLoading,
    isError: allCardsIsError,
  } = useGetApprovedCards({})
  const {
    cardOwners,
    isLoading: cardOwnersIsLoading,
    isError: cardOwnersIsError,
  } = useGetCardOwners({ cardID: selectedCard?.cardID })

  useEffect(() => {
    setFilteringCards(true)
    let newFilteredCards = []

    if (searchString !== '') {
      const cardsIncludingString = approvedCards.filter((card: Card) => {
        return stringInCardName(card, searchString)
      })

      newFilteredCards = cardsIncludingString
    } else {
      newFilteredCards = approvedCards
    }

    const sortedCards = sortBy(newFilteredCards, (card: Card) => {
      return [card.card_rarity, card.player_name]
    })

    setFilteredCards(sortedCards)
    setFilteringCards(false)
  }, [approvedCards, searchString])

  return (
    <div>
      <PageHeader>Card Search</PageHeader>
      <OptionInput
        options={filteredCards}
        loading={allCardsIsLoading}
        groupBy={(option: Card) => (option ? option.card_rarity : '')}
        getOptionLabel={(option: Card) => (option ? option.player_name : '')}
        label={'Enter player name'}
        onChange={(event, newValue) => {
          setSelectedCard(newValue)
        }}
        onInputChange={(event, newInputValue) => {
          setSearchString(newInputValue)
        }}
        defaultValue={searchString}
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
            <img
              width={300}
              height={400}
              src={`${pathToCards}${selectedCard.image_url}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CardSearch
