import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import { warningToast } from '@utils/toasts'
import axios from 'axios'
import { useState } from 'react'

export default function SubmitImageModal({
  card,
  isOpen,
  onClose,
}: {
  card: Card
  isOpen: boolean
  onClose: () => void
}) {
  const [formError, setFormError] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const { mutateAsync: submitCardImage, isLoading } = mutation({
    mutationFn: () =>
      axios({
        method: POST,
        url: `/api/v3/cards/${card.cardID}/image`,
        data: { image: selectedFile },
      }),
  })

  const convertToBase64 = (file): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
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

  const handleSubmit = async () => {
    if (isLoading) {
      warningToast({ warningText: 'Already submitting a card' })
      return
    }

    try {
      await submitCardImage({ cardID: card.cardID, image: selectedFile })
      setSelectedImage(null)
      setSelectedFile(null)
    } catch (error) {
      console.error(error)
      const errorMessage: string =
        'message' in error
          ? error.message
          : 'Error updating card, please message caltroit_red_flames on Discord'
      setFormError(errorMessage)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Submit Image for #{card.cardID} - {card.player_name}
        </ModalHeader>
        <ModalCloseButton />
        {formError && (
          <Alert status="error">
            <AlertIcon />
            {formError}
          </Alert>
        )}
        <div className="flex flex-col items-center justify-end">
          <div className="flex justify-center items-center m-6">
            {selectedImage && <img src={selectedImage} />}
          </div>
          Upload Card Image
          <input disabled={isLoading} type="file" onChange={onFileChange} />
          <div className="flex items-center justify-end p-6">
            <Button
              disabled={isLoading}
              className="text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-100 rounded hover:shadow-lg"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={handleSubmit}
            >
              Submit Image
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}
