import React, { useState, useEffect } from 'react'
import { FormGroup, Button, Box, Paper } from '@material-ui/core'
import { FormSelectField, FormTextField, OptionInput } from '@components/index'
import Router from 'next/router'
import { useClaimedCards } from '@hooks/index'
import find from 'lodash/find'
import sortBy from 'lodash/sortBy'
import stringInCardName from '@utils/string-in-card-name'

const SubmitCards = () => {
  const [filteringCards, setFilteringCards] = useState<boolean>(false)
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [selectedCard, setSelectedCard] = useState<Card>(null)
  const { claimedCards, isLoading, isError } = useClaimedCards()
  const canSubmit = selectedCard && selectedFile

  useEffect(() => {
    setFilteringCards(true)
    let newFilteredCards = []

    if (searchString !== '') {
      const cardsIncludingString = claimedCards.filter((card) => {
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
      newFilteredCards = claimedCards
    }

    const sortedCards = sortBy(newFilteredCards, (card) => {
      return [card.rarity, card.playerName]
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
        groupBy={(option) => (option ? option.rarity : '')}
        getOptionLabel={(option) => (option ? option.playerName : '')}
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
              <FormTextField
                label={'Player Name'}
                value={selectedCard.playerName}
                disabled={true}
              />
              <FormSelectField
                label={'Team Name'}
                labelId={'team-label'}
                value={selectedCard.team}
                disabled={true}
                options={{
                  team: {
                    label: selectedCard.team,
                  },
                }}
              />
              <FormSelectField
                label={'Rarity'}
                labelId={'rarity-label'}
                value={selectedCard.rarity}
                disabled={true}
                options={{
                  rarity: {
                    label: selectedCard.rarity,
                  },
                }}
              />
              <FormSelectField
                label={'Position'}
                labelId={'position-label'}
                value={selectedCard.position}
                disabled={true}
                options={{
                  position: {
                    label: selectedCard.position,
                  },
                }}
              />
              <FormTextField
                label={'Overall'}
                value={selectedCard.overall}
                disabled={true}
              />
              <FormTextField
                label={selectedCard.position !== 'G' ? 'Skating' : 'High Shots'}
                value={
                  selectedCard.position !== 'G'
                    ? selectedCard.skating
                    : selectedCard.highShots
                }
                disabled={true}
              />
              <FormTextField
                label={selectedCard.position !== 'G' ? 'Shooting' : 'Low Shots'}
                value={
                  selectedCard.position !== 'G'
                    ? selectedCard.shooting
                    : selectedCard.lowShots
                }
                disabled={true}
              />
              <FormTextField
                label={selectedCard.position !== 'G' ? 'Hands' : 'Quickness'}
                value={
                  selectedCard.position !== 'G'
                    ? selectedCard.hands
                    : selectedCard.quickness
                }
                disabled={true}
              />
              <FormTextField
                label={selectedCard.position !== 'G' ? 'Checking' : 'Control'}
                value={
                  selectedCard.position !== 'G'
                    ? selectedCard.checking
                    : selectedCard.control
                }
                disabled={true}
              />
              <FormTextField
                label={
                  selectedCard.position !== 'G' ? 'Defense' : 'Conditioning'
                }
                value={
                  selectedCard.position !== 'G'
                    ? selectedCard.defense
                    : selectedCard.conditioning
                }
                disabled={true}
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
