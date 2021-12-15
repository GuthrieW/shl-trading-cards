import React, { useState, useEffect } from 'react'
import { FormGroup, Button, Box } from '@material-ui/core'
import { CardRequestForm, OptionInput } from '@components/index'
import { useGetClaimedCards } from '@pages/api/queries/index'
import sortBy from 'lodash/sortBy'
import { getUidFromSession, stringInCardName } from '@utils/index'
import { useSubmitCardImage } from '@pages/api/mutations'

const SubmitCards = () => {
  const [filteringCards, setFilteringCards] = useState<boolean>(false)
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [selectedCard, setSelectedCard] = useState<Card>(null)
  const {
    claimedCards,
    isLoading: getClaimedCardsIsLoading,
    isError: getClaimedCardsIsError,
  } = useGetClaimedCards({
    uid: getUidFromSession(),
  })
  const {
    submitCardImage,
    response,
    isLoading: submitCardImageIsLoading,
    isError: submitCardImageIsError,
  } = useSubmitCardImage()

  const canSubmit = selectedCard && selectedFile

  useEffect(() => {
    setFilteringCards(true)

    let newFilteredCards = []

    if (searchString !== '') {
      const cardsIncludingString = claimedCards.filter((card: Card) => {
        return stringInCardName(card, searchString)
      })

      newFilteredCards = cardsIncludingString
    } else {
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
    submitCardImage({ cardID: selectedCard.cardID, image: selectedFile })
    setSelectedCard(null)
    setSelectedFile(null)
    setSearchString('')
  }

  return (
    <div
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
        loading={getClaimedCardsIsLoading || filteringCards}
        groupBy={(option: Card) =>
          option.card_rarity ? option.card_rarity : ''
        }
        getOptionLabel={(option: Card) =>
          option.player_name ? option.player_name : ''
        }
        label={'Enter claimed card name'}
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
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box style={{ width: '50%' }}>
            <FormGroup>
              <CardRequestForm
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
    </div>
  )
}

export default SubmitCards
