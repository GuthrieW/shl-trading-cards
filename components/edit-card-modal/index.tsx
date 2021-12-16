import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import CardEditForm from '@components/card-edit-form'
import { pathToCards } from '@constants/index'

type EditCardModalProps = {
  open: boolean
  handleSubmitCard: any
  handleSubmitImage: any
  handleClose: any
  card: Card
}

const EditCardModal = ({
  open,
  handleSubmitCard,
  handleSubmitImage,
  handleClose,
  card,
}: EditCardModalProps) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
  >
    {card && (
      <>
        <DialogTitle id="alert-dialog-title">{`Edit CardID: ${card.cardID}`}</DialogTitle>
        <DialogContent>
          <img
            width={300}
            height={400}
            src={`${pathToCards}${card.image_url}`}
          />
          <CardEditForm
            initialValues={card}
            handleSubmitCard={handleSubmitCard}
            handleSubmitImage={handleSubmitImage}
            handleClose={handleClose}
            formDisabled={false}
          />
        </DialogContent>
      </>
    )}
  </Dialog>
)

export default EditCardModal
