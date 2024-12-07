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
import DeleteBinder from '@components/modals/DeleteBinder'

interface UsersBindersCarouselProps {
  binderData: binders[]
  reachedLimit: boolean
}

export const UsersBindersCarousel = ({
  binderData,
  reachedLimit,
}: UsersBindersCarouselProps) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedBinderID, setSelectedBinderID] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleDeleteClick = (binderID) => {
    setSelectedBinderID(binderID)
    setIsDeleteOpen(true)
  }

  const onDeleteClose = () => {
    setIsDeleteOpen(false)
  }

  const settings: Settings = {
    dots: true,
    className: 'center',
    centerMode: true,
    infinite: (binderData?.length || 0) > 3,
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
          infinite: (binderData?.length || 0) > 1,
          className: 'center',
          centerMode: true,
          adaptiveHeight: true,
          arrows: false,
        },
      },
    ],
  }

  const remainingBinders = 5 - (binderData?.length || 0)

  return (
    <>
      <div className="carousel-container">
        <Slider {...settings}>
          {binderData &&
            binderData.length > 0 &&
            binderData.map((binder) => (
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
                      <HamburgerIcon />
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
                        className="hover:!bg-red200 !text-red200 hover:!text-primary text-xs md:text-lg"
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
              className="!bg-boxscore-header border-3 border-table-header !text-secondary"
              p={4}
              shadow="lg"
            >
              <CardHeader className="text-center"></CardHeader>
              <CardBody className="text-center">
                {' '}
                <Button
                  colorScheme="blue"
                  onClick={onOpen}
                  size="lg"
                  isDisabled={reachedLimit}
                >
                  Create Binder
                </Button>
              </CardBody>
              <CardFooter></CardFooter>
            </Card>
          ))}
        </Slider>
      </div>
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

export default UsersBindersCarousel
