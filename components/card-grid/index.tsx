import {
  Grid,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Badge,
} from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

const StyledImage = styled.img`
  margin: 0;
  padding: 10;
  max-width: 100%;
  max-height: 100%;
`
export type CardModalProps = {
  card: any
  currentCard: any
  handleOpenCard: Function
  handleCloseCard: Function
  open: boolean
  duplicates: number
}

const CardGrid = ({
  card,
  currentCard,
  handleOpenCard,
  handleCloseCard,
  open,
  duplicates,
}) => {
  return (
    <Grid key={card.playerName} item xs={6} md={4} lg={3}>
      <Box onClick={() => handleOpenCard(card)}>
        <Badge badgeContent={duplicates ? duplicates : null} color={'primary'}>
          <StyledImage width={300} height={400} src={card.imageUrl} />
        </Badge>
      </Box>
      <Dialog
        open={open}
        onClose={handleCloseCard}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {currentCard && (
            <img width={300} height={400} src={currentCard.imageUrl} />
          )}
        </DialogContent>
        {currentCard && (
          <DialogTitle id="alert-dialog-title">
            {currentCard.playerName} - {currentCard.rarity}
          </DialogTitle>
        )}
      </Dialog>
    </Grid>
  )
}

export default CardGrid
