import React, { useMemo, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
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
  useBreakpointValue,
} from '@chakra-ui/react'
import { query } from '@pages/api/database/query'
import { CardInformation } from '@components/collection/CardInformation'
import axios from 'axios'
import { BackOfCard } from '@components/collection/BackOfCard'
import TradingCard from '@components/images/TradingCard'
import { CardMakerInfo } from '@pages/api/v3'
import { GET } from '@constants/http-methods'
import { formatDateTime } from '@utils/formatDateTime'

type CardLightBoxModalProps = {
  setShowModal: Function
  cardName: string
  cardImage: string
  owned: number
  rarity: string
  playerID: number
  cardID: number
  userID: string
}

const THRESHOLD = 30

const CardLightBoxModal = ({
  setShowModal,
  cardName,
  cardImage,
  owned,
  rarity,
  playerID,
  cardID,
  userID,
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
  const isOwned = useMemo(() => {
    return userID !== undefined && owned > 0
  }, [userID, owned])

  const { payload: cardMakerInfo } = query<CardMakerInfo[]>({
    queryKey: ['cardMakerInfo', String(cardID)],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/cards/${cardID}/info`,
      }),
    enabled: !!cardID,
  })

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
  return (
    <>
      <Modal
        isOpen={isOpen}
        blockScrollOnMount={false}
        onClose={onClose}
        isCentered
        motionPreset="scale"
      >
        <ModalContent>
          <ModalHeader className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl ">
            {cardName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="bg-secondary flex-grow overflow-y-auto p-0">
            <div
              className="w-full h-full relative motion-reduce:hover:transform-none"
              style={{ transformStyle: 'preserve-3d' }}
              onMouseMove={(event) => {
                const mouseX =
                  event.nativeEvent.offsetX -
                  cardFrontRef.current.clientWidth / 2
                const mouseY =
                  event.nativeEvent.offsetY -
                  cardFrontRef.current.clientHeight / 2

                cardFrontRef.current.style.transform = `perspective(${
                  cardFrontRef.current.clientWidth
                }px) rotateX(${-mouseY / THRESHOLD}deg) rotateY(${
                  mouseX / THRESHOLD
                }deg) scale3d(.87, .87, .87)`
                shineRef.current.style.transform = `perspective(${
                  cardFrontRef.current.clientWidth
                }px) rotateX(${-mouseY / THRESHOLD}deg) rotateY(${
                  mouseX / THRESHOLD
                }deg) scale3d(.87, .87, .87)`
                shineRef.current.style.background = `radial-gradient(circle at ${event.nativeEvent.offsetX}px ${event.nativeEvent.offsetY}px, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 100%)`
              }}
              onMouseLeave={(event) => {
                cardFrontRef.current.style.transform = `perspective(${cardFrontRef.current.clientWidth}px) rotateX(0deg) rotateY(0deg)`
                shineRef.current.style.transform = `perspective(${cardFrontRef.current.clientWidth}px) rotateX(0deg) rotateY(0deg)`
              }}
            >
              <Box
                ref={cardContainerRef}
                position="relative"
                width="100%"
                height={useBreakpointValue({
                  base: '500px',
                  md: '550px',
                  lg: '550px',
                })}
                maxW="800px"
                mx="auto"
                style={{
                  perspective: '1200px',
                  backfaceVisibility: 'hidden',
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
                    className="flex-grow overflow-y-auto p-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      pointerEvents: isFlipped ? 'none' : 'auto',
                    }}
                  >
                    <TradingCard
                      className={`${
                        !isOwned && userID !== undefined ? 'grayscale' : ''
                      }`}
                      source={cardImage}
                      rarity={rarity}
                      playerName={cardName}
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
                    overflow={!isFlipped ? 'hidden' : ''}
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      pointerEvents: isFlipped ? 'auto' : 'none',
                    }}
                  >
                    {isLoading ? (
                      <Spinner />
                    ) : (
                      playerHistory && (
                        <BackOfCard
                          cardID={String(cardID)}
                          userID={userID}
                          isOwned={isOwned}
                        />
                      )
                    )}
                  </Box>
                </Box>
              </Box>
            </div>
          </ModalBody>
          <ModalFooter className="bg-secondary">
            <Button onClick={onDrawerOpen} mr={2}>
              Show Info
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
        <DrawerContent overflow="hidden" overflowY="scroll">
          <DrawerCloseButton className="bg-primary" />
          <DrawerHeader className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
            Card Information
            <div>
              {cardMakerInfo
                ? cardMakerInfo?.map((info) => (
                    <div key={info.userID} className="text-sm">
                      Created by: {info.username}
                    </div>
                  ))
                : null}
              {cardMakerInfo && cardMakerInfo[0].date_approved !== null ? (
                <div className="text-sm">
                  Date Approved:{' '}
                  {formatDateTime(cardMakerInfo[0].date_approved)}
                </div>
              ) : (
                <div className="text-sm">Date Approved: None Recorded</div>
              )}
            </div>
          </DrawerHeader>
          <DrawerBody className="bg-secondary">
            <CardInformation
              owned={isOwned}
              playerID={playerID}
              cardID={cardID}
              userID={userID}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default CardLightBoxModal
