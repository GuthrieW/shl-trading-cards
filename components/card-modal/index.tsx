import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'

type CardModalProps = {
  open: boolean
  handleCardClose: any
  card: Card
}

const CardModal = ({ open, handleCardClose, card }: CardModalProps) => (
  <Dialog
    open={open}
    onClose={handleCardClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogContent>
      {card && <img width={300} height={400} src={card.imageUrl} />}
    </DialogContent>
    {card && (
      <DialogTitle id="alert-dialog-title">
        {card.playerName} - {card.rarity}
      </DialogTitle>
    )}
  </Dialog>
)

export default CardModal
