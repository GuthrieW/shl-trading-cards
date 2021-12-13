import React from 'react'
import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core'

type ApproveDenyModalProps = {
  open: boolean
  card: Card
  handleAccept: any
  handleDeny: any
  handleClose: any
}

const ApproveDenyModal = ({
  open,
  card,
  handleAccept,
  handleDeny,
  handleClose,
}: ApproveDenyModalProps) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
  >
    <DialogTitle id="alert-dialog-title">Approve/Deny Card</DialogTitle>
    <DialogContent>
      <img width={300} height={400} src={card.image_url} />
      {card.player_name} - {card.card_rarity}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Button onClick={handleAccept} color="default" variant="outlined">
          Accept
        </Button>
        <Button onClick={handleDeny} color="secondary" variant="outlined">
          Deny
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)

export default ApproveDenyModal
