import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import {
  Box,
  Text,
  Skeleton,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
  FormHelperText,
} from '@chakra-ui/react'
import { binders } from '@pages/api/v3'
import { GET, PUT } from '@constants/http-methods'
import axios from 'axios'
import { EditIcon } from '@chakra-ui/icons'
import { useSession } from 'contexts/AuthContext'
import { mutation } from '@pages/api/database/mutation'
import { successToastOptions } from '@utils/toast'

const BinderHeader = ({ bid }: { bid: string }) => {
  const { session } = useSession();
  const { isOpen, onOpen: openModal, onClose } = useDisclosure();
  const [editedName, setEditedName] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const queryClient = useQueryClient()
  const toast = useToast();

  const { data, isLoading } = useQuery<{ status: string; payload: binders[] }>({
    queryKey: ['users-binders', bid],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/binder?bid=${bid}`,
      }).then((response) => response.data),
    enabled: !!bid,
  });

  const onOpen = () => {
    setEditedName(data?.payload[0]?.binder_name || '');
    setEditedDesc(data?.payload[0]?.binder_desc || '');
    openModal();
  };

  const isOwner = Number(session?.userId) === data?.payload[0]?.userID;

  const { mutateAsync: editBinderHeader, isLoading: isLoadingCreateBinder } =
    mutation<void, Record<string, string>>({
      mutationFn: async () => {
        return axios({
          method: PUT,
          url: `/api/v3/binder/${bid}/update`,
          headers: {
            Authorization: `Bearer ${session}`,
          },
          data: {
            bid: bid,
            name: editedName,
            desc: editedDesc,
          },
        })
      },
      onSuccess: () => {
        toast({
          title: 'Edited Binder Name or Description',
          ...successToastOptions,
        })
        queryClient.invalidateQueries(['users-binders', bid]);
        onClose()
      },
      onError: (error) => {
        toast({
          title: 'Error Editing Binder Name or Description',
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
        await editBinderHeader({
          bid: bid,
          binderName: editedName,
          binderDesc: editedDesc,
        })
      } catch (error) {
        console.error('Error updating binder:', error)
      }
    }

  if (isLoading) {
    return (
      <Box className="border-b-8 border-b-blue700 bg-secondary p-4">
        <VStack spacing={4} align="stretch">
          <Skeleton height="24px" width="60%" />
          <Skeleton height="20px" width="80%" />
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <Box className="border-b-8 border-b-blue700 bg-secondary p-4">
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Flex alignItems="center" gap={2}>
            <Text className="text-lg font-bold">{data.payload[0]?.binder_name}</Text>
            {isOwner && (
              <Button
                size="sm"
                variant="ghost"
                className="!text-secondary !hover:bg-primary"
                onClick={onOpen}
                leftIcon={<EditIcon />}
                aria-label="Edit binder"
              />
            )}
          </Flex>
          <Text className="text-lg font-bold">By: {data.payload[0]?.username}</Text>
        </Flex>
        <Text className="mt-2 text-secondary">{data.payload[0]?.binder_desc}</Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent className="!bg-primary !text-secondary">
          <ModalHeader>Edit Binder Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="bg-primary text-secondary" pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Binder Name</FormLabel>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  maxLength={100}
                  placeholder="Enter binder name"
                  disabled={isLoadingCreateBinder}
                />
                <FormHelperText className="text-secondary">
                  {editedName.length}/100 characters
                </FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Binder Description</FormLabel>
                <Textarea
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  maxLength={400}
                  placeholder="Enter binder description"
                  rows={4}
                  disabled={isLoadingCreateBinder}
                />
                <FormHelperText className="text-secondary">
                  {editedDesc.length}/400 characters
                </FormHelperText>
              </FormControl>

              <Button
                colorScheme="blue"
                type="submit"
                width="full"
                isLoading={isLoadingCreateBinder}
                loadingText="Updating..."
              >
                Update
              </Button>
            </VStack>
          </form>
        </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BinderHeader;