import React from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core'

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img width={300} height={400} src={card[14]} />
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Button
            style={{ marginRight: '5px', marginLeft: '5px' }}
            onClick={handleAccept}
            color="primary"
            variant="contained"
          >
            Accept
          </Button>
          <Button
            style={{ marginRight: '5px', marginLeft: '5px' }}
            onClick={handleDeny}
            color="secondary"
            variant="contained"
          >
            Deny
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

export default ApproveDenyModal
