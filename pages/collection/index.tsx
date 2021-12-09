import React, { useEffect, useState } from 'react'
import { Avatar, Box, Chip } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import sortBy from 'lodash/sortBy'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { CollectionGrid, OptionInput, PageHeader } from '@components/index'
import { useGetCurrentUser, useGetUserCards } from '@pages/api/queries/index'
import { filterOptions } from '@constants/index'
import { stringInCardName } from '@utils/index'

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
  } = useGetCurrentUser()

  const collectionUsername =
    typeof username === 'string' ? username : currentUser.username

  const {
    userCards,
    isLoading: userCardsIsLoading,
    isError: userCardsIsError,
  } = useGetUserCards(collectionUsername)

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

    const newFilteredCards = userCards.filter((card) => {
      return (
        stringInCardName(card, searchString) &&
        (allDisabled || selectedRarityNames.includes(card.card_rarity))
      )
    })

    const sortedCards = sortBy(newFilteredCards, (card) => {
      return [card.rarity, card.playerName]
    })

    setFilteredCards(sortedCards)
    setFilteringCards(false)
  }, [searchString, rarityOptions, userCards])

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
        loading={userCardsIsLoading || filteringCards}
        groupBy={(option: Card) => (option ? option.card_rarity : '')}
        getOptionLabel={(option: Card) => (option ? option.player_name : '')}
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
