import Button from '@components/buttons/button'
import React from 'react'
import { Field, Form, Formik } from 'formik'
import rarityMap from '@constants/rarity-map'
import positionMap from '@constants/position-map'

type FieldType = 'string_input' | 'number_input' | 'switch' | 'select'

type SelectData = {
  label: string
  value: string
}

type Field = {
  field: string
  label: string
  fieldType: FieldType
  selectOptions?: SelectData[]
}

type EditCardFormProps = {
  cardData: Card
  setShowModal: Function
  onSubmit: Function
}

const EditCardForm = ({
  cardData,
  setShowModal,
  onSubmit,
}: EditCardFormProps) => {
  const TextField = ({ name, label, type, disabled = false }) => (
    <div className="m-2 flex justify-between">
      <label htmlFor={name}>{label}</label>
      <Field id={name} name={name} type={type} disabled={disabled} />
    </div>
  )

  const SelectField = ({ name, label, options, disabled = false }) => (
    <div className="m-2 flex justify-between">
      <label htmlFor={name}>{label}</label>
      <Field id={name} name={name} as="select" disabled={disabled}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
    </div>
  )

  return (
    <Formik
      initialValues={cardData}
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
          <TextField name="player_name" label="Player Name" type="text" />
          <TextField name="playerID" label="Player ID" type="number" />
          <TextField name="teamID" label="Team ID" type="number" />
          <TextField
            name="author_userID"
            label="Author User ID"
            type="number"
          />
          <TextField name="approved" label="Approved" type="number" />
          <TextField name="pullable" label="Pullable" type="number" />
          <TextField name="author_paid" label="Author Paid" type="number" />
          <TextField name="image_url" label="Image URL" type="text" />
          <SelectField
            name="card_rarity"
            label="Rarity"
            options={Object.values(rarityMap)}
          />

          <TextField name="season" label="Season" type="number" />
          <SelectField
            name="position"
            label="Position"
            options={Object.values(positionMap)}
          />
          <TextField
            name="overall"
            label="Overall"
            type="number"
            disabled={false}
          />
          <TextField
            name="skating"
            label="Skating"
            type="number"
            disabled={cardData.position === 'G'}
          />
          <TextField
            name="shooting"
            label="Shooting"
            type="number"
            disabled={cardData.position === 'G'}
          />
          <TextField
            name="hands"
            label="Hands"
            type="number"
            disabled={cardData.position === 'G'}
          />
          <TextField
            name="checking"
            label="Checking"
            type="number"
            disabled={cardData.position === 'G'}
          />
          <TextField
            name="defense"
            label="Defense"
            type="number"
            disabled={cardData.position === 'G'}
          />
          <TextField
            name="high_shots"
            label="High Shots"
            type="number"
            disabled={cardData.position !== 'G'}
          />
          <TextField
            name="low_shots"
            label="Low Shots"
            type="number"
            disabled={cardData.position !== 'G'}
          />
          <TextField
            name="quickness"
            label="Quickness"
            type="number"
            disabled={cardData.position !== 'G'}
          />
          <TextField
            name="control"
            label="Control"
            type="number"
            disabled={cardData.position !== 'G'}
          />
          <TextField
            name="conditioning"
            label="Conditioning"
            type="number"
            disabled={cardData.position !== 'G'}
          />
          <div className="flex items-center justify-end p-6">
            <Button
              disabled={false}
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
              disabled={false}
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            >
              Update Card
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default EditCardForm
