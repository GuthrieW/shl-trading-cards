import { useState } from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useToast,
  Checkbox,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useQueryClient } from 'react-query'

interface DeleteBinder {
  selectedBinderID: number
  isOpen: boolean
  onClose: () => void
}

const DeleteBinder: React.FC<DeleteBinder> = ({
  selectedBinderID,
  isOpen,
  onClose,
}) => {
  const { session } = useSession()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false)
  const { onClose: onDeleteClose } = useDisclosure()

  const handleDeleteBinder = async () => {
    if (isDeleteConfirmed && selectedBinderID) {
      await axios.delete(`/api/v3/binder/${selectedBinderID}/delete`, {
        headers: { Authorization: `Bearer ${session?.token}` },
        data: {
          bid: selectedBinderID,
        },
      })
      toast({
        title: 'Successfully Deleted Binder',
        status: 'success',
      })
      queryClient.invalidateQueries(['users-binders'])
      onDeleteClose()
      onClose()
      setIsDeleteConfirmed(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onDeleteClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="bg-primary text-secondary">
          Confirm Delete
        </ModalHeader>
        <ModalBody className="bg-primary text-secondary">
          <div>Are you sure you want to delete this binder?</div>
          <Checkbox
            mt={4}
            isChecked={isDeleteConfirmed}
            onChange={(e) => setIsDeleteConfirmed(e.target.checked)}
          >
            I confirm I want to delete this binder
          </Checkbox>
        </ModalBody>
        <ModalFooter className="bg-primary text-secondary">
          <Button
            colorScheme="red"
            isDisabled={!isDeleteConfirmed}
            onClick={handleDeleteBinder}
          >
            Confirm Delete
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteBinder
