import React, { useEffect, useState } from 'react'
import { Avatar, Box, Chip } from '@material-ui/core'
import OptionInput from '@components/option-input'
import filterOptions from './rarity-options'
import CardGrid from '@components/card-grid'
import { CollectionPage, GridContainer } from './styled'
import { Pagination } from '@material-ui/lab'
import sortBy from 'lodash/sortBy'
import useUserCards from '@hooks/use-user-cards'
import { stringInCardName } from '@utils/index'

type CollectionProps = {
  username: string
}

const UsernameHeader = ({ username }) => {
  const displayUsername = username ? `${username}\'s` : 'My'
  return <h1>{displayUsername} Collection</h1>
}

const Collection = ({ username }: CollectionProps) => {
  const [rarityOptions, setRarityOptions] = useState<Rarity[]>(filterOptions)
  const [searchString, setSearchString] = useState<string>('')
  const [filteringCards, setFilteringCards] = useState<boolean>(false)
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentCard, setCurrentCard] = useState<Card>(null)

  const { cards, isLoading, isError } = useUserCards(username)

  const cardsPerPage = 12

  useEffect(() => {
    setFilteringCards(true)
    setPageNumber(1)

    const selectedRarityNames = rarityOptions
      .filter((rarityOption) => {
        return rarityOption.enabled
      })
      .map((filteredRarityOption) => {
        return filteredRarityOption.rarity
      })

    const allDisabled = selectedRarityNames.length === 0

    const newFilteredCards = cards.filter((card) => {
      return (
        stringInCardName(card, searchString) &&
        (allDisabled || selectedRarityNames.includes(card.rarity))
      )
    })

    const sortedCards = sortBy(newFilteredCards, (card) => {
      return [card.rarity, card.playerName]
    })

    setFilteredCards(sortedCards)
    setFilteringCards(false)
  }, [searchString, rarityOptions, cards])

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
        loading={isLoading}
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

export default Collection
