import Button from '@components/buttons/button'
import { SelectField } from '@components/inputs/select'
import { TextField } from '@components/inputs/textfield'
import useEditDonator from '@pages/api/mutations/use-edit-donator'
import { Form, Formik } from 'formik'
import React from 'react'

type EditDonatorFormProps = {
  donator: Donator
  setShowModal: Function
}

const EditDonatorForm = ({ donator, setShowModal }: EditDonatorFormProps) => {
  console.log('donator', donator)
  const { editDonator, response, isSuccess, isLoading, isError } =
    useEditDonator()

  return (
    <div className="flex flex-col">
      <Formik
        initialValues={donator}
        onSubmit={(values) => {
          event.preventDefault()
          console.log('values', values)
          editDonator({
            uid: donator.uid,
            subscription: values.subscription,
          })
          setShowModal(false)
        }}
      >
        {({ handleSubmit }) => (
          <Form>
            <SelectField
              name="subscription"
              label="Subscription"
              disabled={isLoading || false}
              options={[
                { label: 0, value: 0 },
                { label: 1, value: 1 },
              ]}
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
                Update Subscription
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EditDonatorForm
