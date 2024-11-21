import React, { useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'
import {
  Box,
  CardHeader,
  CardBody,
  Card,
  SimpleGrid,
  Heading,
  CardFooter,
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Skeleton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Divider,
  MenuDivider,
  Link,
} from '@chakra-ui/react'
import { binders } from '@pages/api/v3'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import CreateBinder from '@components/modals/CreateBinder'
import { HamburgerIcon } from '@chakra-ui/icons'

interface UsersBindersProps {
  binderData: binders[]
  reachedLimit: boolean
}

const UsersBinders = ({ binderData, reachedLimit }: UsersBindersProps) => {
  const router = useRouter()
  const [selectedBinderID, setSelectedBinderID] = useState<number | null>(null)
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false)
  const { session } = useSession()
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

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
      setSelectedBinderID(null)
      setIsDeleteConfirmed(false)
    }
  }

  const remainingBinders = useMemo(() => {
    return 5 - binderData.length
  }, [binderData])

  return (
    <>
      <SimpleGrid spacing={6} templateColumns="repeat(auto-fill, min(250px))">
        {binderData.map((binder) => (
          <Card
            as="a"
            className="!bg-boxscore-header border-3 border-table-header !text-secondary hover:!bg-boxscore-header/20"
            p={4}
            h="100%"
            shadow="lg"
          >
            <Link href={`/binder/${binder.binderID}`} key={binder.binderID}>
              <CardHeader className="text-center">
                <Heading size="md">{binder.binder_name}</Heading>
              </CardHeader>
              <CardBody className="text-center">
                <div>
                  {binder.binder_desc.length > 75
                    ? `${binder.binder_desc.slice(0, 75)}...`
                    : binder.binder_desc}
                </div>
              </CardBody>
            </Link>
            <CardFooter className="relative w-full h-8 flex items-center justify-start">
              <Menu>
                <MenuButton
                  as="div"
                  className="absolute bottom-1 right-1 flex items-center text-center justify-center w-8 h-8 border border-secondary rounded-md bg-primary cursor-pointer hover:bg-highlighted/40 hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <HamburgerIcon />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    className="hover:!bg-highlighted/40 hover:!text-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(
                        `/binder/${binder.binderID}?updateBinder=true`
                      )
                    }}
                  >
                    Edit Binder
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    className="hover:!bg-highlighted/40 hover:!text-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedBinderID(binder.binderID)
                      onDeleteOpen()
                    }}
                  >
                    Delete Binder
                  </MenuItem>
                </MenuList>
              </Menu>
            </CardFooter>
          </Card>
        ))}
        {Array.from({ length: remainingBinders }).map((_, idx) => (
          <Card
            key={`skeleton-${idx}`}
            className="!bg-boxscore-header border-3 border-table-header !text-secondary hover:!bg-boxscore-header/20"
            p={4}
            shadow="lg"
          >
            <CardHeader className="text-center"></CardHeader>
            <CardBody className="text-center">
              <Button
                colorScheme="blue"
                onClick={onOpen}
                size="md"
                isDisabled={reachedLimit}
              >
                Create Binder
              </Button>
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
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
            <Button colorScheme="red" onClick={handleDeleteBinder}>
              Confirm Delete
            </Button>
            <Button onClick={onDeleteClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <CreateBinder isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default UsersBinders
