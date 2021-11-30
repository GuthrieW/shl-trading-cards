import React, { useEffect, useState } from 'react'
import cards from '@utils/test-data/cards.json'
import { Avatar, Box, Chip, Grid } from '@material-ui/core'
import OptionInput from '@components/option-input'
import FilterOptions from './FilterOptions'
import CardGrid from '@components/card-grid'

type CollectionProps = {
  username: string
}

const Collection = ({ username }: CollectionProps) => {
  const [searchString, setSearchString] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filterOptions, setFilterOptions] = useState(FilterOptions)
  const [cardsLoading, setCardsLoading] = useState(true)
  const [collectionCards, setCollectionCards] = useState(cards.data)
  const [currentCard, setCurrentCard] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    setCardsLoading(true)

    // setCollectionCards([])
    setCardsLoading(false)
  }, [])

  const handleChipClick = (filterOption, index) => {
    setPageNumber(1)
    const filterOptionsCopy = [...filterOptions]
    filterOptionsCopy[index].enabled = !filterOption.enabled
    setFilterOptions(filterOptionsCopy)
  }

  const handleClickOpen = (card) => {
    setCurrentCard(card)
    setIsOpen(true)
  }

  const handleClose = () => {
    setCurrentCard(null)
    setIsOpen(false)
  }

  return (
    <div style={{ margin: '10px' }}>
      <UsernameHeader username={username} />
      <Box whiteSpace={'nowrap'} overflow={'auto'}>
        {filterOptions.map((filterOption, index) => (
          <Chip
            key={filterOption.rarity}
            variant={filterOption.enabled ? 'default' : 'outlined'}
            label={filterOption.rarity}
            avatar={<Avatar src={filterOption.imageUrl} />}
            onClick={() => handleChipClick(filterOption, index)}
          />
        ))}
      </Box>
      <OptionInput
        options={collectionCards}
        loading={cardsLoading}
        groupBy={(option) => (option ? option.rarity : '')}
        getOptionLabel={(option) => (option ? option.playerName : '')}
        label={'Enter player name'}
        onInputChange={(event, newInputValue) => {
          setSearchString(newInputValue)
        }}
      />
      <Grid style={{ margin: '0', marginTop: '16' }} container>
        {collectionCards.length > 0 &&
          collectionCards.map((card, index) => {
            const numberOfDuplicates = collectionCards.filter(
              (collectionCard) => collectionCard.playerName === card.playerName
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
      </Grid>
    </div>
  )
}

const UsernameHeader = ({ username }) => {
  const displayUsername = username ? `${username}\'s` : 'My'
  return <h1>{displayUsername} Collection</h1>
}

export default Collection
