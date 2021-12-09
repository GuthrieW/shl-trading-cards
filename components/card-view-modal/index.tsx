import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'

type CardViewModalProps = {
  open: boolean
  handleCardClose: any
  card: Card
}

const CardViewModal = ({ open, handleCardClose, card }: CardViewModalProps) => (
  <Dialog
    open={open}
    onClose={handleCardClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
  >
    {card && (
      <>
        <DialogTitle id="alert-dialog-title">
          {card.player_name} - {card.card_rarity}
        </DialogTitle>
        <DialogContent>
          <img width={300} height={400} src={card.image_url} />
        </DialogContent>
      </>
    )}
  </Dialog>
)

export default CardViewModal
