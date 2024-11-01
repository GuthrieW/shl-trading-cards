import { useState } from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormHelperText,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import { successToastOptions } from '@utils/toast'
import axios from 'axios'
import { useCookie } from '@hooks/useCookie'
import config from 'lib/config'
import { useSession } from 'contexts/AuthContext'
import { useQueryClient } from 'react-query'

interface CreateBinder {
  isOpen: boolean
  onClose: () => void
}

const CreateBinder: React.FC<CreateBinder> = ({ isOpen, onClose }) => {
  const [binderName, setBinderName] = useState('')
  const [binderDescription, setBinderDescription] = useState('')
  const [userid] = useCookie(config.userIDCookieName)
  const { session } = useSession()
  const toast = useToast()
  const queryClient = useQueryClient()

  const { mutateAsync: createBinder, isLoading: isLoadingCreateBinder } =
    mutation<void, Record<string, string>>({
      mutationFn: async () => {
        return axios({
          method: POST,
          url: '/api/v3/binder/create',
          headers: {
            Authorization: `Bearer ${session}`,
          },
          data: {
            userID: userid,
            binderName: binderName,
            binderDesc: binderDescription,
          },
        })
      },
      onSuccess: () => {
        toast({
          title: 'Created Binder, switch tabs to upload cards',
          ...successToastOptions,
        })
        queryClient.invalidateQueries(['users-binders'])
        onClose()
        setBinderName('')
        setBinderDescription('')
      },
      onError: (error) => {
        toast({
          title: 'Error creating binder',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      },
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createBinder({
        userID: userid,
        binderName: binderName,
        binderDesc: binderDescription,
      })
    } catch (error) {
      console.error('Error creating binder:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="bg-primary text-secondary">
          Create New Binder
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="bg-primary text-secondary" pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Binder Name</FormLabel>
                <Input
                  value={binderName}
                  onChange={(e) => setBinderName(e.target.value)}
                  maxLength={100}
                  placeholder="Enter binder name"
                  disabled={isLoadingCreateBinder}
                />
                <FormHelperText className="text-secondary">
                  {binderName.length}/100 characters
                </FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Binder Description</FormLabel>
                <Textarea
                  value={binderDescription}
                  onChange={(e) => setBinderDescription(e.target.value)}
                  maxLength={400}
                  placeholder="Enter binder description"
                  rows={4}
                  disabled={isLoadingCreateBinder}
                />
                <FormHelperText className="text-secondary">
                  {binderDescription.length}/400 characters
                </FormHelperText>
              </FormControl>

              <Button
                colorScheme="blue"
                type="submit"
                width="full"
                isLoading={isLoadingCreateBinder}
                loadingText="Creating..."
              >
                Create
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreateBinder
