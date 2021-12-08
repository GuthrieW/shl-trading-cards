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
      {card && <img width={300} height={400} src={card.image_url} />}
    </DialogContent>
    {card && (
      <DialogTitle id="alert-dialog-title">
        {card.player_name} - {card.card_rarity}
      </DialogTitle>
    )}
  </Dialog>
)

export default CardModal
