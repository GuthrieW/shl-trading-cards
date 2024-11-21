import React, { useMemo, useState } from 'react'
import Slider, { type Settings } from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {
  Box,
  CardHeader,
  CardBody,
  Card,
  Heading,
  Button,
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
  CardFooter,
  Checkbox,
  Link,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useQueryClient } from 'react-query'
import CreateBinder from '@components/modals/CreateBinder'
import { binders } from '@pages/api/v3'
import { HamburgerIcon } from '@chakra-ui/icons'

interface UsersBindersCarouselProps {
  binderData: binders[]
  reachedLimit: boolean
}

export const UsersBindersCarousel = ({
  binderData,
  reachedLimit,
}: UsersBindersCarouselProps) => {
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

  const settings: Settings = {
    dots: true,
    className: 'center',
    centerMode: true,
    infinite: binderData.length > 3,
    centerPadding: '0',
    slidesToShow: 3,
    speed: 500,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: binderData.length > 1,
          className: 'center',
          centerMode: true,
          adaptiveHeight: true,
          arrows: false,
        },
      },
    ],
  }

  const remainingBinders = 5 - binderData.length

  return (
    <>
      <div className="carousel-container">
        <Slider {...settings}>
          {binderData.map((binder) => (
            <Card
              key={binder.binderID}
              className="!bg-boxscore-header border-3 border-table-header !text-secondary h-full"
              p={4}
              shadow="lg"
            >
              <Link href={`/binder/${binder.binderID}`} key={binder.binderID}>
                <CardHeader className="text-center">
                  <Heading size="md">{binder.binder_name}</Heading>
                </CardHeader>
                <CardBody className="text-center">
                  <div>
                    {binder.binder_desc.length > 25
                      ? `${binder.binder_desc.slice(0, 25)}...`
                      : binder.binder_desc}
                  </div>
                </CardBody>
              </Link>
              <CardFooter className="relative w-full h-8 flex items-center text-center justify-center">
                <Menu>
                  <MenuButton
                    as="div"
                    className="flex w-8 h-8 border border-secondary rounded-md bg-primary cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HamburgerIcon></HamburgerIcon>
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      className="hover:!bg-highlighted/40 hover:!text-primary text-xs md:text-lg"
                      onClick={() =>
                        router.push(
                          `/binder/${binder.binderID}?updateBinder=true`
                        )
                      }
                    >
                      Edit Binder
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      className="hover:!bg-highlighted/40 hover:!text-primary text-xs md:text-lg"
                      onClick={() => {
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
              className="!bg-boxscore-header border-3 border-table-header !text-secondary"
              p={4}
              shadow="lg"
            >
              <CardHeader className="text-center">
                <Heading>
                  <Button
                    colorScheme="blue"
                    onClick={onOpen}
                    size="lg"
                    isDisabled={reachedLimit}
                  >
                    Create Binder
                  </Button>
                </Heading>
              </CardHeader>
              <CardBody className="text-center"></CardBody>
              <CardFooter></CardFooter>
            </Card>
          ))}
        </Slider>
      </div>
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

export default UsersBindersCarousel
