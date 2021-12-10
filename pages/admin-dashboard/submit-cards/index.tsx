import React, { useState, useEffect } from 'react'
import { FormGroup, Button, Box, Paper } from '@material-ui/core'
import {
  CardForm,
  FormSelectField,
  FormTextField,
  OptionInput,
} from '@components/index'
import Router from 'next/router'
import { useGetClaimedCards } from '@pages/api/queries/index'
import sortBy from 'lodash/sortBy'
import stringInCardName from '@utils/string-in-card-name'
import { teams } from '@constants/index'

const SubmitCards = () => {
  const [filteringCards, setFilteringCards] = useState<boolean>(false)
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [selectedCard, setSelectedCard] = useState<Card>(null)
  const { claimedCards, isLoading, isError } = useGetClaimedCards()
  const canSubmit = selectedCard && selectedFile

  useEffect(() => {
    setFilteringCards(true)
    let newFilteredCards = []

    if (searchString !== '') {
      const cardsIncludingString = claimedCards.filter((card: Card) => {
        return stringInCardName(card, searchString)
      })

      const matchingCards = cardsIncludingString.filter((card: Card) => {
        return card.player_name === searchString
      })

      matchingCards.length === 1
        ? setSelectedCard(matchingCards[0])
        : setSelectedCard(null)

      newFilteredCards = cardsIncludingString
    } else {
      setSelectedCard(null)
      newFilteredCards = claimedCards
    }

    const sortedCards = sortBy(newFilteredCards, (card: Card) => {
      return [card.card_rarity, card.player_name]
    })
    setFilteredCards(sortedCards)
    setFilteringCards(false)
  }, [claimedCards, searchString])

  const onFileChange = (event) => {
    const file = URL.createObjectURL(event.target.files[0])
    setSelectedFile(file)
  }

  const handleSubmit = () => {
    Router.reload()
  }

  return (
    <Paper
      elevation={4}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'static',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <OptionInput
        options={filteredCards}
        loading={isLoading || filteringCards}
        groupBy={(option: Card) => (option ? option.card_rarity : '')}
        getOptionLabel={(option: Card) => (option ? option.player_name : '')}
        label={'Enter claimed card name'}
        onInputChange={(event, newInputValue) => {
          setSearchString(newInputValue)
        }}
      />
      {selectedCard && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box style={{ width: '50%' }}>
            <FormGroup>
              <CardForm
                handleOnChange={null}
                cardData={selectedCard}
                formDisabled={true}
              />
              <Box m={2}>
                <Button
                  variant="contained"
                  component="label"
                  style={{ alignSelf: 'center', marginRight: '10px' }}
                >
                  Upload Card Image
                  <input type="file" onChange={onFileChange} hidden />
                </Button>
                <Button
                  disabled={!canSubmit}
                  style={{ alignSelf: 'center' }}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit Card
                </Button>
              </Box>
            </FormGroup>
          </Box>
          <Box
            style={{
              width: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selectedFile && <img className={null} src={selectedFile} />}
          </Box>
        </div>
      )}
    </Paper>
  )
}

export default SubmitCards
