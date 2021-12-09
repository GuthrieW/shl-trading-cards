import React, { useState } from 'react'
import { DataTable } from '@components/index'
import { useGetAllCards } from '@pages/api/queries/index'
import { goalieColumns, skaterColumns } from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'

const EditCards = () => {
  const { allCards, isLoading, isError } = useGetAllCards()
  console.log(allCards)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<Card>(null)
  const skaterCards = onlySkaterCards(allCards)
  const goalieCards = onlyGoalieCards(allCards)
  const skaterTableOptions = {
    onRowClick: (rowData: string[]) => {
      const skaterCard: Card = {
        cardID: parseInt(rowData[0]),
        teamID: parseInt(rowData[1]),
        playerID: parseInt(rowData[2]),
        author_userID: parseInt(rowData[3]),
        player_name: rowData[4],
        card_rarity: rowData[5],
        pullable: rowData[6] === 'true',
        approved: rowData[7] === 'true',
        position: rowData[8],
        overall: parseInt(rowData[9]),
        skating: parseInt(rowData[10]),
        shooting: parseInt(rowData[11]),
        hands: parseInt(rowData[12]),
        checking: parseInt(rowData[13]),
        defense: parseInt(rowData[14]),
        high_shots: null,
        low_shots: null,
        quickness: null,
        control: null,
        conditioning: null,
        image_url: rowData[15],
      }
      setSelectedRow(skaterCard)
      setIsOpen(true)
    },
  }

  const goalieTableOptions = {
    onRowClick: (rowData: string[]) => {
      const goalieCard: Card = {
        cardID: parseInt(rowData[0]),
        teamID: parseInt(rowData[1]),
        playerID: parseInt(rowData[2]),
        author_userID: parseInt(rowData[3]),
        player_name: rowData[4],
        card_rarity: rowData[5],
        pullable: rowData[6] === 'true',
        approved: rowData[7] === 'true',
        position: rowData[8],
        overall: parseInt(rowData[9]),
        skating: null,
        shooting: null,
        hands: null,
        checking: null,
        defense: null,
        high_shots: parseInt(rowData[10]),
        low_shots: parseInt(rowData[11]),
        quickness: parseInt(rowData[12]),
        control: parseInt(rowData[13]),
        conditioning: parseInt(rowData[14]),
        image_url: rowData[15],
      }
      setSelectedRow(goalieCard)
      setIsOpen(true)
    },
  }

  return (
    <>
      <DataTable
        title={'Edit a Skater Card'}
        data={skaterCards}
        columns={skaterColumns}
        options={skaterTableOptions}
      />
      <DataTable
        title={'Edit a Goalie Card'}
        data={goalieCards}
        columns={goalieColumns}
        options={goalieTableOptions}
      />
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
          setSelectedRow(null)
        }}
        BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {selectedRow && (
          <>
            <DialogTitle>
              Edit {selectedRow.player_name} - {selectedRow.card_rarity}
            </DialogTitle>
            <DialogContent>
              <img width={300} height={400} src={selectedRow.image_url} />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  )
}

export default EditCards
