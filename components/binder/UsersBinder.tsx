import React, { useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'
import {
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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  Link,
} from '@chakra-ui/react'
import { binders } from '@pages/api/v3'
import { useRouter } from 'next/router'
import CreateBinder from '@components/modals/CreateBinder'
import { HamburgerIcon } from '@chakra-ui/icons'
import DeleteBinder from '@components/modals/DeleteBinder'

interface UsersBindersProps {
  binderData: binders[]
  reachedLimit: boolean
}

const UsersBinders = ({ binderData, reachedLimit }: UsersBindersProps) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedBinderID, setSelectedBinderID] = useState(null)

  const handleDeleteClick = (binderID) => {
    setSelectedBinderID(binderID)
    setIsDeleteOpen(true)
  }

  const onDeleteClose = () => {
    setIsDeleteOpen(false)
  }

  const remainingBinders = useMemo(() => {
    return 5 - binderData.length
  }, [binderData])

  return (
    <>
      <SimpleGrid
        spacing={6}
        templateColumns="repeat(auto-fill, min(250px))"
        mb={4}
      >
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
            <CardFooter className="w-full h-8 flex items-center justify-start">
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
                    className="hover:!bg-red200 !text-red200 hover:!text-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(binder.binderID)
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

      <CreateBinder isOpen={isOpen} onClose={onClose} />
      {isDeleteOpen && (
        <DeleteBinder
          selectedBinderID={selectedBinderID}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )}
    </>
  )
}

export default UsersBinders
