import PageHeader from '@components/page-header'
import {
  useGetApprovedCards,
  useGetAllSets,
  useGetSetCards,
} from '@pages/api/queries'
import { useCreateSet, useDeleteSet, useUpdateSet } from '@pages/api/mutations'
import React, { useEffect, useState } from 'react'
import OptionInput from '@components/option-input'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormGroup,
  TextField,
} from '@mui/material'

const stringInSetName = (set: CardSet, stringToFind: string) => {
  return set.name.toLowerCase().includes(stringToFind.toLowerCase())
}

const EditSets = () => {
  const {
    approvedCards,
    isLoading: getAllCardsIsLoading,
    isError: getAllCardsIsError,
  } = useGetApprovedCards({})
  const {
    allSets,
    isLoading: getAllSetsIsLoading,
    isError: getAllSetsIsError,
  } = useGetAllSets({})
  const {
    updateSet,
    response: updateSetResponse,
    isLoading: updateSetIsLoading,
    isError: updateSetIsError,
  } = useUpdateSet()
  const {
    createSet,
    response: createSetResponse,
    isLoading: createSetIsLoading,
    isError: creaeSetIsError,
  } = useCreateSet()
  const {
    deleteSet,
    response: deleteSetResponse,
    isLoading: deleteSetIsLoading,
    isError: deleteSetIsError,
  } = useDeleteSet()

  const [selectedSet, setSelectedSet] = useState<CardSet>(null)
  const [searchSetsString, setSearchSetsString] = useState<string>('')
  const [searchCardsString, setSearchCardsString] = useState<string>('')
  const [filteredSets, setFilteredSets] = useState<CardSet[]>(null)
  const [filteringSets, setFilteringSets] = useState<boolean>(false)
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [openSetCreationModal, setOpenSetCreationModal] =
    useState<boolean>(false)
  const [newSetName, setNewSetName] = useState<string>('')
  const [newSetDescription, setNewSetDescription] = useState<string>('')

  const {
    refetch: refetchSetCards,
    setCards,
    isLoading: getSetCardsIsLoading,
    isError: getSetCardsIsError,
  } = useGetSetCards({
    setID: selectedSet?.setID || 0,
  })

  useEffect(() => {
    setFilteringSets(true)
    let newFilteredSets = []

    if (searchSetsString !== '') {
      const setNamesIncludingString = allSets.filter((set: CardSet) => {
        return stringInSetName(set, searchSetsString)
      })

      newFilteredSets = setNamesIncludingString
    } else {
      newFilteredSets = allSets
    }

    setFilteredSets(newFilteredSets)
    setFilteringSets(false)
  }, [searchSetsString, allSets])

  useEffect(() => {
    setSelectedCards(setCards)
  }, [setCards])

  return (
    <>
      <PageHeader>Edit Sets</PageHeader>
      <Button
        onClick={() => {
          // createSet({})
          setOpenSetCreationModal(true)
        }}
      >
        Create New Set
      </Button>
      <OptionInput
        options={filteredSets || []}
        loading={getAllSetsIsLoading || filteringSets}
        getOptionLabel={(option: CardSet) => (option ? option.name : '')}
        label={'Select a Set'}
        onChange={(event, newValue) => {
          setSelectedSet(newValue)
        }}
        onInputChange={(event, newInputValue) => {
          setSearchSetsString(newInputValue)
        }}
        defaultValue={''}
      />
      <OptionInput
        value={selectedCards}
        options={approvedCards || []}
        loading={getSetCardsIsLoading}
        groupBy={(option: Card) => (option ? option.card_rarity : '')}
        getOptionLabel={(option: Card) =>
          option
            ? `${option.player_name} - ${option.card_rarity} - ${option.position}`
            : ''
        }
        label={'Select a Card'}
        onChange={(event, newValue) => {
          setSelectedCards(newValue)
          refetchSetCards()
        }}
        onInputChange={(event, newInputValue) => {
          setSearchCardsString(newInputValue)
        }}
        defaultValue={[]}
        multiple={true}
        disabled={!selectedSet || getSetCardsIsLoading || !approvedCards}
      />
      <Button
        onClick={() => {
          updateSet({
            setID: selectedSet.setID,
            name: selectedSet.name,
            description: selectedSet.description,
            cards: selectedCards,
          })
          refetchSetCards()
        }}
      >
        Update Set
      </Button>
      <Button
        onClick={() => {
          deleteSet({
            setID: selectedSet.setID,
          })
        }}
      >
        Delete Set
      </Button>
      <Dialog
        open={openSetCreationModal}
        onClose={() => {
          setOpenSetCreationModal(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
      >
        <DialogTitle id="alert-dialog-title">New Set Info</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FormGroup>
              <TextField
                label={'Name'}
                value={newSetName}
                onChange={(event) => {
                  setNewSetName(event.target.value)
                }}
              />
              <TextField
                label={'Dscription'}
                value={newSetDescription}
                onChange={(event) => {
                  setNewSetDescription(event.target.value)
                }}
              />
              <Button
                onClick={() => {
                  createSet({
                    name: newSetName,
                    description: newSetDescription,
                  })
                  setNewSetName('')
                  setNewSetDescription('')
                  setOpenSetCreationModal(false)
                }}
              >
                Submit
              </Button>
              <Button
                onClick={() => {
                  setNewSetName('')
                  setNewSetDescription('')
                  setOpenSetCreationModal(false)
                }}
              >
                Cancel
              </Button>
            </FormGroup>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditSets
