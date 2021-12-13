import React from 'react'
import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core'

type ConfirmClaimModalProps = {
  open: boolean
  playerName: string
  cardID: string
  handleConfirm: any
  handleClose: any
}

const ConfirmClaimModal = ({
  open,
  playerName,
  cardID,
  handleConfirm,
  handleClose,
}: ConfirmClaimModalProps) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
  >
    <DialogTitle id="alert-dialog-title">Confirm Claim</DialogTitle>
    <DialogContent>
      Card ID: {cardID} - {playerName}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Button onClick={handleConfirm} color="primary" variant="contained">
          Confirm
        </Button>
        <Button onClick={handleClose} color="secondary" variant="contained">
          Close
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)

export default ConfirmClaimModal
