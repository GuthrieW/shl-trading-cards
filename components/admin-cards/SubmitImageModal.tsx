import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import { warningToastOptions } from '@utils/toast'
import axios from 'axios'
import { useState } from 'react'
import { errorToastOptions, successToastOptions } from '@utils/toast'
import { CardInfo } from '@components/common/CardInfo'

export default function SubmitImageModal({
  card,
  isOpen,
  onClose,
}: {
  card: Card
  isOpen: boolean
  onClose: () => void
}) {
  const toast = useToast()
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
    onSuccess: () => {
      toast({
        title: 'Sucessfully Uploaded Card Image',
        ...successToastOptions,
      })
    },
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
      toast({ title: 'Already submitting a card', ...warningToastOptions })
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
      toast({
        title:
          'Error updating card, please message caltroit_red_flames on Discord',
        ...errorToastOptions,
      })
      setFormError(errorMessage)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="!bg-primary !text-secondary">
          Submit Image for #{card.cardID} - {card.player_name} &nbsp;
        </ModalHeader>
        <ModalCloseButton />
        {formError && (
          <Alert className="text-white" status="error">
            <AlertIcon />
            {formError}
          </Alert>
        )}
        <div className="flex flex-col items-center justify-end !bg-primary !text-secondary">
          <div className="flex justify-center items-center m-6">
            {selectedImage && <img src={selectedImage} />}
          </div>
          Upload Card Image
          <input disabled={isLoading} type="file" onChange={onFileChange} />
          <CardInfo card={card} />
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
