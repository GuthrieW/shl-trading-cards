import React, { useState, useMemo } from 'react'
import axios from 'axios'
import {
  Skeleton,
  SkeletonText,
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
  FormControl,
  FormLabel,
  Switch,
  Button,
  useDisclosure,
  Alert,
  AlertIcon,
  useToast,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { GET } from '@constants/http-methods'
import { binders } from '@pages/api/v3'
import { query } from '@pages/api/database/query'
import { useRouter } from 'next/router'
import { useCookie } from '@hooks/useCookie'
import config from 'lib/config'
import CreateBinder from '@components/modals/CreateBinder'
import { useSession } from 'contexts/AuthContext'
import TablePagination from '@components/table/TablePagination'
import { BINDER_CONSTANTS } from 'lib/constants'
import { useQueryClient } from 'react-query'
import UpdateBinder from '@components/binder/UpdateBinder'

const BinderTables = () => {
  const { loggedIn, session } = useSession()
  const router = useRouter()
  const [userIDQuery, setUserID] = useState<string>(null)
  const [uid] = useCookie(config.userIDCookieName)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBinderID, setSelectedBinderID] = useState<number>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const queryClient = useQueryClient()
  const toast = useToast()
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false)
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  const { payload: binders, isLoading } = query<binders[]>({
    queryKey: ['users-binders', userIDQuery],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/binder`,
        params: {
          userID: userIDQuery,
        },
      }),
  })

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

  const userBinders =
    binders?.filter((binder) => binder.userID === Number(uid)) || []
  const reachedLimit = useMemo(
    () => userBinders.length >= 5,
    [userBinders.length]
  )

  const bindersLeft = useMemo(
    () => (reachedLimit ? 0 : 5 - userBinders.length),
    [userBinders.length, reachedLimit]
  )

  const toggleUserID = () => {
    setUserID((prevUserID) => (prevUserID ? null : uid))
  }

  const currentBinders = useMemo(() => {
    const indexOfLastItem = currentPage * BINDER_CONSTANTS.ROWS_PER_PAGE
    const indexOfFirstItem = indexOfLastItem - BINDER_CONSTANTS.ROWS_PER_PAGE
    return binders?.slice(indexOfFirstItem, indexOfLastItem) || []
  }, [binders, currentPage, BINDER_CONSTANTS.ROWS_PER_PAGE])

  return (
    <div className="w-full p-4 min-h-[400px]">
      {isLoading ? (
        <>
          <div className="flex justify-end"></div>
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-table-header">
              <div className="grid grid-cols-4 gap-4 p-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} height="24px" />
                ))}
              </div>
              {Array.from({ length: 10 }).map((_, index) => (
                <Box key={index} p="4" borderTop="1px" borderColor="gray.200">
                  <SkeletonText noOfLines={1} spacing="4" />
                </Box>
              ))}
            </div>
            <div className="flex justify-center pt-4"></div>
          </div>
        </>
      ) : (
        <>
          {loggedIn && (
            <>
              <div className="flex justify-end">
                <FormControl className="flex items-center m-2">
                  <FormLabel className="mb-0 !text-sm !md:text-base">Toggle Your Binders:</FormLabel>
                  <Switch isChecked={!!userIDQuery} onChange={toggleUserID} />
                </FormControl>
                <Button
                  className="!text-sm !md:text-base"
                  colorScheme="blue"
                  onClick={onOpen}
                  size="md"
                  isDisabled={reachedLimit}
                >
                  Create Binder
                </Button>
              </div>
              {reachedLimit ? (
                <Alert status="warning" className="text-black" mb={4}>
                  <AlertIcon />
                  You have reached the maximum limit of 5 binders.
                </Alert>
              ) : (
                <Alert status="info" className="text-black" mb={4}>
                  <AlertIcon />
                  You can create {bindersLeft} more binder
                  {bindersLeft !== 1 ? 's' : ''}.
                </Alert>
              )}
            </>
          )}
          <Box className="rounded-lg overflow-hidden border mt-4">
            <TableContainer>
              <Table variant="simple">
                <Thead className="bg-table-header">
                  <Tr>
                    <Th
                      className="!text-table-header font-semibold py-4"
                      borderBottom="1px solid"
                    >
                      Name
                    </Th>
                    <Th
                      className="!text-table-header font-semibold py-4"
                      borderBottom="1px solid"
                    >
                      User
                    </Th>
                    <Th
                      className="!text-table-header font-semibold py-4"
                      borderBottom="1px solid"
                    >
                      Description
                    </Th>
                    <Th
                      className="!text-table-header font-semibold py-4"
                      borderBottom="1px solid"
                    >
                      Update/Delete
                    </Th>
                  </Tr>
                </Thead>
                <Tbody className="bg-[var(--color-background-table-row)]">
                  {currentBinders.map((binder) => (
                    <Tr
                      key={binder.binderID}
                      className="transition-colors duration-150"
                    >
                      <Td className="text-table-row py-4">
                        <Link
                          className="!hover:no-underline ml-2 block pb-2 text-left !text-link"
                          onClick={() =>
                            router.push(`/binder/${binder.binderID}`)
                          }
                          target="_blank"
                        >
                          {binder.binder_name}
                        </Link>
                      </Td>
                      <Td className="text-table-row py-4">{binder.username}</Td>
                      <Td className="text-table-row py-4 max-w-md truncate">
                        {binder.binder_desc}
                      </Td>
                      <Td className="text-right">
                        {' '}
                        {binder.userID === Number(session?.userId) && (
                          <>
                            <Button
                              colorScheme="blue"
                              onClick={() =>
                                router.push(`/binder/${binder.binderID}?updateBinder=true`)
                              }
                              size="sm"
                              mr={2}
                            >
                              Edit Binder
                            </Button>
                            <Button
                              colorScheme="red"
                              onClick={() => {
                                setSelectedBinderID(binder.binderID)
                                onDeleteOpen()
                              }}
                              size="sm"
                            >
                              Delete Binder
                            </Button>
                          </>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            {!isLoading && (
              <TablePagination
                totalRows={binders?.length}
                rowsPerPage={BINDER_CONSTANTS.ROWS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            )}
          </Box>
          <CreateBinder isOpen={isOpen} onClose={onClose} />

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
        </>
      )}
    </div>
  )
}

export default BinderTables
