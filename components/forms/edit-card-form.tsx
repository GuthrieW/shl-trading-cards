import Button from '@components/buttons/button'
import React, { useMemo } from 'react'
import { Form, Formik } from 'formik'
import rarityMap from '@constants/rarity-map'
import positionMap from '@constants/position-map'
import TradingCard from '@components/images/trading-card'
import { TextField } from '@components/inputs/textfield'
import { SelectField } from '@components/inputs/select'
import useSendToAwaitingClaim from '@pages/api/mutations/use-send-to-awaiting-claim'
import useSendToAwaitingSubmission from '@pages/api/mutations/use-send-to-awaiting-submission'

type EditCardFormProps = {
  card: Card
  setShowModal: Function
  onSubmit: Function
}

const EditCardForm = ({ card, setShowModal, onSubmit }: EditCardFormProps) => {
  const {
    sendToAwaitingClaim,
    isSuccess: sendToAwaitingClaimIsSuccess,
    isLoading: sendToAwaitingClaimIsLoading,
    isError: sendToAwaitingClaimIsError,
  } = useSendToAwaitingClaim()
  const {
    sendToAwaitingSubmission,
    isSuccess: sendToAwaitingSubmissionIsSuccess,
    isLoading: sendToAwaitingSubmissionIsLoading,
    isError: sendToAwaitingSubmissionIsError,
  } = useSendToAwaitingSubmission()

  const isLoading = useMemo(
    () => sendToAwaitingClaimIsLoading || sendToAwaitingSubmissionIsLoading,
    [sendToAwaitingClaimIsLoading, sendToAwaitingSubmissionIsLoading]
  )

  const isSkater = card.position !== 'G'
  return (
    <div className="flex flex-row items-center m-2">
      <Formik
        initialValues={card}
        onSubmit={(values) => {
          event.preventDefault()
          const newData: Card = {
            player_name: values?.player_name,
            cardID: values?.cardID,
            playerID: values?.playerID,
            teamID: values?.teamID,
            author_userID: values?.author_userID,
            approved: values?.approved,
            pullable: values?.pullable,
            author_paid: values?.author_paid,
            image_url: values?.image_url,
            card_rarity: values?.card_rarity,
            sub_type: values?.sub_type ? values?.sub_type : null,
            season: values?.season,
            position: values?.position,
            overall: values?.overall,
            skating: values?.skating,
            shooting: values?.shooting,
            hands: values?.hands,
            checking: values?.checking,
            defense: values?.defense,
            high_shots: values.high_shots,
            low_shots: values?.low_shots,
            quickness: values?.quickness,
            control: values?.control,
            conditioning: values?.conditioning,
          }
          setShowModal(false)
          onSubmit(newData)
        }}
      >
        {({ handleSubmit }) => (
          <Form>
            <TextField
              name="player_name"
              label="Player Name"
              type="text"
              disabled={isLoading}
            />
            <TextField
              name="playerID"
              label="Player ID"
              type="number"
              disabled={isLoading}
            />
            <TextField
              name="teamID"
              label="Team ID"
              type="number"
              disabled={isLoading}
            />
            <TextField
              name="author_userID"
              label="Author User ID"
              type="number"
              disabled={isLoading || true}
            />
            <TextField
              name="approved"
              label="Approved"
              type="number"
              disabled={isLoading || true}
            />
            <TextField
              name="pullable"
              label="Pullable"
              type="number"
              disabled={isLoading || true}
            />
            <TextField
              name="author_paid"
              label="Author Paid"
              type="number"
              disabled={isLoading || true}
            />
            <TextField
              name="image_url"
              label="Image URL"
              type="text"
              disabled={isLoading || true}
            />
            <SelectField
              name="card_rarity"
              label="Rarity"
              options={Object.values(rarityMap)}
              disabled={isLoading}
            />
            <TextField
              name="sub_type"
              label="Sub Type"
              type="text"
              disabled={isLoading}
            />
            <TextField
              name="season"
              label="Season"
              type="number"
              disabled={isLoading}
            />
            <SelectField
              name="position"
              label="Position"
              disabled={isLoading || true}
              options={Object.values(positionMap)}
            />
            <TextField
              name="overall"
              label="Overall"
              type="number"
              disabled={isLoading || false}
            />
            <TextField
              name="skating"
              label="Skating"
              type="number"
              disabled={isLoading || !isSkater}
              hidden={!isSkater}
            />
            <TextField
              name="shooting"
              label="Shooting"
              type="number"
              disabled={isLoading || !isSkater}
              hidden={!isSkater}
            />
            <TextField
              name="hands"
              label="Hands"
              type="number"
              disabled={isLoading || !isSkater}
              hidden={!isSkater}
            />
            <TextField
              name="checking"
              label="Checking"
              type="number"
              disabled={isLoading || !isSkater}
              hidden={!isSkater}
            />
            <TextField
              name="defense"
              label="Defense"
              type="number"
              disabled={isLoading || !isSkater}
              hidden={!isSkater}
            />
            <TextField
              name="high_shots"
              label="High Shots"
              type="number"
              disabled={isLoading || isSkater}
              hidden={isSkater}
            />
            <TextField
              name="low_shots"
              label="Low Shots"
              type="number"
              disabled={isLoading || isSkater}
              hidden={isSkater}
            />
            <TextField
              name="quickness"
              label="Quickness"
              type="number"
              disabled={isLoading || isSkater}
              hidden={isSkater}
            />
            <TextField
              name="control"
              label="Control"
              type="number"
              disabled={isLoading || isSkater}
              hidden={isSkater}
            />
            <TextField
              name="conditioning"
              label="Conditioning"
              type="number"
              disabled={isLoading || isSkater}
              hidden={isSkater}
            />
            <div className="flex items-center justify-end p-6">
              <Button
                disabled={isLoading || false}
                className="text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-100 rounded hover:shadow-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault()
                  handleSubmit()
                }}
                disabled={isLoading || false}
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              >
                Update Card
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="flex flex-col items-start ml-5 mr-2 my-2">
        {card.image_url && (
          <TradingCard
            source={card.image_url}
            rarity={card.card_rarity}
            playerName={card.player_name}
          />
        )}
        <div className="flex flex-col w-full items-center justify-center my-2 space-y-2">
          {card.author_userID && (
            <Button
              disabled={isLoading || false}
              onClick={() => {
                sendToAwaitingClaim({ cardID: card.cardID })
                setShowModal(false)
              }}
            >
              Set to Needs Author
            </Button>
          )}
          {card.image_url && (
            <Button
              disabled={isLoading || false}
              onClick={() => {
                sendToAwaitingSubmission({ cardID: card.cardID })
                setShowModal(false)
              }}
            >
              Set to Awaiting Submission
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditCardForm
