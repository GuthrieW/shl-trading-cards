import React, { useEffect, useState } from 'react'
import { Avatar, Box, Chip, Grid } from '@material-ui/core'
import OptionInput from '@components/option-input'
import filterOptions from '@utils/rarity-options'
import CollectionGrid from '@components/collection-grid'
import { Pagination } from '@material-ui/lab'
import sortBy from 'lodash/sortBy'
import useUserCards from '@hooks/use-user-cards'
import { stringInCardName } from '@utils/index'
import PageHeader from '@components/page-header'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import useCurrentUser from '@hooks/use-current-user'

const CollectionPage = styled.div`
  margin: 10px;
`

const Collection = () => {
  const [rarityOptions, setRarityOptions] = useState<Rarity[]>(filterOptions)
  const [searchString, setSearchString] = useState<string>('')
  const [filteringCards, setFilteringCards] = useState<boolean>(false)
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentCard, setCurrentCard] = useState<Card>(null)

  const router = useRouter()
  const { username } = router.query

  const {
    currentUser,
    isLoading: currentUserIsLoading,
    isError: currentUserIsError,
  } = useCurrentUser()

  const collectionUsername =
    typeof username === 'string' ? username : currentUser.username

  const {
    cards,
    isLoading: userCardsIsLoading,
    isError: userCardsIsError,
  } = useUserCards(collectionUsername)

  const cardsPerPage = 12
  const headerDisplay = collectionUsername ? `${collectionUsername}\'s` : 'My'

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

  const handleOpen = (card) => {
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
      <PageHeader>{`${headerDisplay} Collection`}</PageHeader>
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
        loading={userCardsIsLoading}
        groupBy={(option) => (option ? option.rarity : '')}
        getOptionLabel={(option) => (option ? option.playerName : '')}
        label={'Enter player name'}
        onInputChange={(event, newInputValue) => {
          handleSearchStringUpdate(newInputValue)
        }}
      />
      <CollectionGrid
        filteredCards={filteredCards}
        pageNumber={pageNumber}
        cardsPerPage={cardsPerPage}
        handleOpenCard={handleOpen}
        handleCloseCard={handleClose}
        open={isOpen}
        currentCard={currentCard}
      />
      <Pagination
        count={Math.ceil(filteredCards.length / cardsPerPage)}
        onChange={handlePageChange}
        page={pageNumber}
      />
    </CollectionPage>
  )
}

export default Collection
