import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Image,
  ModalHeader,
  Button,
  ModalFooter,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  Spinner,
} from '@chakra-ui/react'
import pathToCards from '@constants/path-to-cards'
import { IndexRecordTable } from 'components/collection/IndexRecordTable'
import axios from 'axios'
import { DisplayHistory } from '@components/collection/DisplayHistory'

type CardLightBoxModalProps = {
  setShowModal: Function
  cardName: string
  cardImage: string
  owned: number
  playerID: number
}

const THRESHOLD = 30

const CardLightBoxModal = ({
  setShowModal,
  cardName,
  cardImage,
  owned,
  playerID,
}: CardLightBoxModalProps) => {
  const { isOpen, onClose } = useDisclosure({
    isOpen: true,
    onClose: () => setShowModal(false),
  })

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure()

  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [playerHistory, setPlayerHistory] = useState(null)
  const cardContainerRef = React.useRef<HTMLDivElement>(null)
  const cardFrontRef = React.useRef<HTMLDivElement>(null)
  const shineRef = React.useRef<HTMLDivElement>(null)
  const isOwned = owned > 0

  const handleFlip = async () => {
    setIsLoading(true)
    setIsFlipped(!isFlipped)

    if (!playerHistory) {
      try {
        const response = await axios.get(
          `https://portal.simulationhockey.com/api/v1/history/player?fhmID=${playerID}&leagueID=0`
        )
        setPlayerHistory(response.data)
      } catch (error) {
        console.error('Failed to fetch player history:', error)
      }
    }

    setIsLoading(false)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return

    const rect = cardContainerRef.current!.getBoundingClientRect()
    const mouseX = event.clientX - rect.left - rect.width / 2
    const mouseY = event.clientY - rect.top - rect.height / 2

    const transform = `perspective(1000px) rotateX(${
      -mouseY / THRESHOLD
    }deg) rotateY(${mouseX / THRESHOLD}deg) scale3d(1, 1, 1)`
    cardFrontRef.current!.style.transform = transform
    shineRef.current!.style.transform = transform
    shineRef.current!.style.background = `radial-gradient(circle at ${
      event.clientX - rect.left
    }px ${
      event.clientY - rect.top
    }px, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 100%)`
  }

  const handleMouseLeave = () => {
    if (isFlipped) return

    cardFrontRef.current!.style.transform =
      'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    shineRef.current!.style.transform =
      'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    shineRef.current!.style.background = 'none'
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
        <ModalContent>
          <ModalHeader className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
            {cardName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="bg-secondary">
            <Box
              ref={cardContainerRef}
              position="relative"
              width="100%"
              height="550px"
              style={{
                perspective: '1200px',
              }}
            >
              <Box
                position="relative"
                width="100%"
                height="100%"
                transition="transform 0.6s"
                transform={isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <Box
                  ref={cardFrontRef}
                  position="absolute"
                  width="100%"
                  height="100%"
                  style={{
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <Image
                    className={`${!isOwned ? 'grayscale' : ''}`}
                    alt={cardName}
                    src={`${pathToCards}${cardImage}`}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    rounded="md"
                    boxShadow="lg"
                  />
                  <Box
                    ref={shineRef}
                    position="absolute"
                    top="0"
                    left="0"
                    w="100%"
                    h="100%"
                    pointerEvents="none"
                  />
                </Box>
                <Box
                  position="absolute"
                  width="100%"
                  height="100%"
                  p={4}
                  rounded="md"
                  boxShadow="lg"
                  overflowY="auto"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    playerHistory && <DisplayHistory playerID={playerID} />
                  )}
                </Box>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter className="bg-secondary">
            <Button onClick={onDrawerOpen} mr={2}>
              Show Stats
            </Button>
            <Button onClick={handleFlip}>Flip</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={onDrawerClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton className="bg-primary" />
          <DrawerHeader className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
            Player Stats
          </DrawerHeader>
          <DrawerBody className="bg-secondary">
            <IndexRecordTable owned={owned} playerID={playerID} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default CardLightBoxModal
