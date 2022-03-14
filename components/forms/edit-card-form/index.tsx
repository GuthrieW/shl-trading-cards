import Button from '@components/buttons/button'
import React, { useState } from 'react'

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
  const [updatedCard, setUpdatedCard] = useState<Card>(cardData)

  const formFields: Field[] = [
    {
      field: 'player_name',
      label: 'Player Name',
      fieldType: 'string_input',
    },
    {
      field: 'cardID',
      label: 'Card ID',
      fieldType: 'number_input',
    },
    {
      field: 'playerID',
      label: 'Player ID',
      fieldType: 'number_input',
    },
    {
      field: 'teamID',
      label: 'Team ID',
      fieldType: 'number_input',
    },
    {
      field: 'author_userID',
      label: 'Author ID',
      fieldType: 'number_input',
    },
    {
      field: 'approved',
      label: 'Approved',
      fieldType: 'switch',
    },
    {
      field: 'pullable',
      label: 'Pullable',
      fieldType: 'switch',
    },
    {
      field: 'author_paid',
      label: 'Author Paid',
      fieldType: 'switch',
    },
    {
      field: 'image_url',
      label: 'Image',
      fieldType: 'string_input',
    },
    {
      field: 'rarity',
      label: 'Rarity',
      fieldType: 'select',
      selectOptions: [
        {
          label: 'Bronze',
          value: 'bronze',
        },
        {
          label: 'Silver',
          value: 'silver',
        },
        {
          label: 'Gold',
          value: 'gold',
        },
        {
          label: 'Ruby',
          value: 'ruby',
        },
        {
          label: 'Diamond',
          value: 'diamond',
        },
      ],
    },
    {
      field: 'season',
      label: 'Season',
      fieldType: 'number_input',
    },
    {
      field: 'position',
      label: 'Position',
      fieldType: 'select',
      selectOptions: [
        {
          label: 'F',
          value: 'F',
        },
        {
          label: 'D',
          value: 'D',
        },
        {
          label: 'G',
          value: 'G"',
        },
      ],
    },
    {
      field: 'overall',
      label: 'Overall',
      fieldType: 'number_input',
    },
    {
      field: cardData.position !== 'G' ? 'skating' : 'high_shots',
      label: cardData.position !== 'G' ? 'Skating' : 'High Shots',
      fieldType: 'number_input',
    },
    {
      field: cardData.position !== 'G' ? 'shooting' : 'low_shots',
      label: cardData.position !== 'G' ? 'Shooting' : 'Low Shots',
      fieldType: 'number_input',
    },
    {
      field: cardData.position !== 'G' ? 'hands' : 'quickness',
      label: cardData.position !== 'G' ? 'Hands' : 'Quickness',
      fieldType: 'number_input',
    },
    {
      field: cardData.position !== 'G' ? 'checking' : 'control',
      label: cardData.position !== 'G' ? 'Checking' : 'Control',
      fieldType: 'number_input',
    },
    {
      field: cardData.position !== 'G' ? 'defense' : 'conditioning',
      label: cardData.position !== 'G' ? 'Defense' : 'Conditioning',
      fieldType: 'number_input',
    },
  ]

  return (
    <form className="flex flex-col justify-center items-center">
      {formFields.map((formField) => {
        if (formField.fieldType === 'number_input') {
          return (
            <div className="m-2 flex justify-center">
              {formField.label}:{' '}
              <input
                value={updatedCard[formField.field]}
                onChange={(event) => {
                  console.log('Field', formField.field)
                  console.log('New Value', event.target.value)
                  setUpdatedCard({
                    ...updatedCard,
                    [formField.field]: parseInt(event.target.value),
                  })
                }}
                type="number"
              />
            </div>
          )
        }

        if (formField.fieldType === 'string_input') {
          return (
            <div className="m-2 flex justify-center">
              {formField.label}:{' '}
              <input
                value={updatedCard[formField.field]}
                onChange={(event) => {
                  console.log('Field', formField.field)
                  console.log('New Value', event.target.value)
                  setUpdatedCard({
                    ...updatedCard,
                    [formField.field]: event.target.value,
                  })
                }}
                type="text"
              />
            </div>
          )
        }

        if (formField.fieldType === 'select') {
          return (
            <div className="m-2 flex justify-center">
              {formField.label}:{' '}
              <select
                value={updatedCard[formField.field]}
                onChange={(event) => {
                  console.log('Field', formField.field)
                  console.log('New Value', event.target.value)
                  setUpdatedCard({
                    ...updatedCard,
                    [formField.field]: event.target.value,
                  })
                }}
              >
                {formField.selectOptions.map((selectOption) => (
                  <option value={selectOption.value}>
                    {selectOption.label}
                  </option>
                ))}
              </select>
            </div>
          )
        }

        if (formField.fieldType === 'switch') {
          return (
            <div className="m-2 flex justify-center">
              <div className="form-check form-switch">
                <label className="form-check-label inline-block text-gray-800">
                  {formField.label}
                </label>
                <input
                  value={updatedCard[formField.field]}
                  onChange={(event) => {
                    console.log('Field', formField.field)
                    console.log('New Value', event.target.value)
                    setUpdatedCard({
                      ...updatedCard,
                      [formField.field]: event.target.value,
                    })
                  }}
                  className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          )
        }
      })}
      <div className="flex items-center justify-end p-6">
        <Button
          disabled={false}
          className="text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-100 rounded hover:shadow-lg"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </Button>
        <Button
          disabled={false}
          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          onClick={() => {
            setShowModal(false)
            onSubmit({})
          }}
        >
          Update Card
        </Button>
      </div>
    </form>
  )
}

export default EditCardForm
