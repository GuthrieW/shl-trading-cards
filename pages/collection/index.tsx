import React, { useEffect, useState } from 'react'
import { Avatar, Box, Chip } from '@material-ui/core'
import OptionInput from '@components/option-input'
import filterOptions from './rarity-options'
import CardGrid from '@components/card-grid'
import { CollectionPage, GridContainer } from './styled'
import { Pagination } from '@material-ui/lab'
import sortBy from 'lodash/sortBy'
import cards from '@utils/test-data/cards.json'

type CollectionProps = {
  username: string
}

const Collection = ({ username }: CollectionProps) => {
  const [rarityOptions, setRarityOptions] = useState(filterOptions)
  const [searchString, setSearchString] = useState('')
  const [cardsLoading, setCardsLoading] = useState(true)
  const [collectionCards, setCollectionCards] = useState<any>([])
  const [filteredCards, setFilteredCards] = useState(collectionCards)
  const [pageNumber, setPageNumber] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [currentCard, setCurrentCard] = useState(null)
  const cardsPerPage = 12

  useEffect(() => {
    setCardsLoading(true)
    setCollectionCards(cards.data)
    setCardsLoading(false)
  }, [])

  useEffect(() => {
    setCardsLoading(true)
    setPageNumber(1)

    const newFilteredCards = []
    const selectedRarityNames = []
    let allDisabled = true

    rarityOptions.map((rarityOption) => {
      if (rarityOption.enabled) {
        allDisabled = false
        selectedRarityNames.push(rarityOption.rarity)
      }
    })

    for (const card of collectionCards) {
      if (card.playerName.toLowerCase().includes(searchString.toLowerCase())) {
        if (allDisabled || selectedRarityNames.includes(card.rarity)) {
          newFilteredCards.push(card)
        }
      }
    }

    const sortedCards = sortBy(newFilteredCards, (card) => {
      return [card.rarity, card.playerName]
    })

    setFilteredCards(sortedCards)
    setCardsLoading(false)
  }, [searchString, rarityOptions, collectionCards])

  const handleSearchStringUpdate = (newSearchString) => {
    setSearchString(newSearchString)
  }

  const handleRarityOptionsUpdate = (rarityOption, index) => {
    const rarityOptionsCopy = [...rarityOptions]
    rarityOptionsCopy[index].enabled = !rarityOption.enabled
    setRarityOptions(rarityOptionsCopy)
  }

  const handleClickOpen = (card) => {
    setCurrentCard(card)
    setIsOpen(true)
  }

  const handleClose = () => {
    setCurrentCard(null)
    setIsOpen(false)
  }

  const handlePageChange = (event, value) => {
    setPageNumber(value)
  }

  return (
    <CollectionPage>
      <UsernameHeader username={username} />
      <Box whiteSpace={'nowrap'} overflow={'auto'}>
        {rarityOptions.map((rarityOption, index) => (
          <Chip
            key={rarityOption.rarity}
            variant={rarityOption.enabled ? 'default' : 'outlined'}
            label={rarityOption.rarity}
            avatar={<Avatar src={rarityOption.imageUrl} />}
            onClick={() => handleRarityOptionsUpdate(rarityOption, index)}
          />
        ))}
      </Box>
      <OptionInput
        options={filteredCards}
        loading={cardsLoading}
        groupBy={(option) => (option ? option.rarity : '')}
        getOptionLabel={(option) => (option ? option.playerName : '')}
        label={'Enter player name'}
        onInputChange={(event, newInputValue) => {
          handleSearchStringUpdate(newInputValue)
        }}
      />
      <GridContainer container>
        {filteredCards.length > 0 &&
          filteredCards
            .slice((pageNumber - 1) * cardsPerPage, pageNumber * cardsPerPage)
            .map((card, index) => {
              const numberOfDuplicates = filteredCards.filter(
                (collectionCard) =>
                  collectionCard.playerName === card.playerName
              ).length

              return card ? (
                <CardGrid
                  card={card}
                  currentCard={currentCard}
                  handleOpenCard={() => {
                    handleClickOpen(card)
                  }}
                  handleCloseCard={handleClose}
                  open={isOpen}
                  duplicates={numberOfDuplicates}
                />
              ) : null
            })}
      </GridContainer>
      <Pagination
        count={Math.ceil(filteredCards.length / cardsPerPage)}
        onChange={handlePageChange}
        page={pageNumber}
      />
    </CollectionPage>
  )
}

const UsernameHeader = ({ username }) => {
  const displayUsername = username ? `${username}\'s` : 'My'
  return <h1>{displayUsername} Collection</h1>
}

export default Collection
