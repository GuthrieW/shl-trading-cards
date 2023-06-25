import React, { useState } from 'react'
import Modal from './modal'
import Button from '@components/buttons/button'
import useSubmitCardImage from '@pages/api/mutations/use-submit-card-image'
import { warningToast } from '@utils/toasts'

type SubmitCardModalProps = {
  setShowModal: Function
  card: Card
}

const SubmitCardModal = ({ setShowModal, card }: SubmitCardModalProps) => {
  const { submitCardImage, response, isSuccess, isLoading, isError } =
    useSubmitCardImage()

  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const convertToBase64 = (file): Promise<string> => {
    return new Promise((resolve) => {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const baseUrl = reader.result as string
        resolve(baseUrl)
      }
    })
  }

  const onFileChange = async (event) => {
    const file = event.target.files[0]
    const imageViewer = URL.createObjectURL(file)
    const base64File = await convertToBase64(file)
    setSelectedImage(imageViewer)
    setSelectedFile(base64File)
  }

  const handleSubmit = () => {
    if (isLoading) {
      warningToast({ warningText: 'Already submitting a card' })
      return
    }

    submitCardImage({ cardID: card.cardID, image: selectedFile })
    setSelectedImage(null)
    setSelectedFile(null)
  }

  return (
    <Modal
      setShowModal={setShowModal}
      title="Submit a Card"
      subtitle={`${card.player_name} - ${card.cardID}`}
    >
      <div className="flex flex-col items-center justify-end">
        <div className="flex justify-center items-center m-6">
          {selectedImage && <img src={selectedImage} />}
        </div>
        Upload Card Image
        <input type="file" onChange={onFileChange} />
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
              handleSubmit()
              setShowModal(false)
            }}
          >
            Submit Card
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default SubmitCardModal
