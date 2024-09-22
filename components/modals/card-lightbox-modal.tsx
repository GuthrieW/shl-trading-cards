import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
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
} from '@chakra-ui/react';
import pathToCards from '@constants/path-to-cards';
import { IndexRecordTable } from 'components/collection/IndexRecordTable';

type CardLightBoxModalProps = {
  setShowModal: Function;
  cardName: string;
  cardImage: string;
  owned: number;
  playerID: number;
};

const THRESHOLD = 30;

const CardLightBoxModal = ({
  setShowModal,
  cardName,
  cardImage,
  owned,
  playerID
}: CardLightBoxModalProps) => {
  const { isOpen, onClose } = useDisclosure({
    isOpen: true, // ensures that modal opens immediately, controlled by setShowModal
    onClose: () => setShowModal(false),
  });

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure(); 

  const cardImageRef = React.useRef<HTMLImageElement>(null);
  const shineRef = React.useRef<HTMLDivElement>(null);
  const isOwned = owned > 0;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
        <ModalContent>
          <ModalHeader className = 'border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl '>{cardName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className = 'bg-secondary'>
            {cardImage && (
              <Box
                w="full"
                h="full"
                position="relative"
                onMouseMove={(event) => {
                  const mouseX =
                    event.nativeEvent.offsetX -
                    cardImageRef.current!.clientWidth / 2;
                  const mouseY =
                    event.nativeEvent.offsetY -
                    cardImageRef.current!.clientHeight / 2;

                  cardImageRef.current!.style.transform = `perspective(${
                    cardImageRef.current!.clientWidth
                  }px) rotateX(${-mouseY / THRESHOLD}deg) rotateY(${
                    mouseX / THRESHOLD
                  }deg) scale3d(1, 1, 1)`;
                  shineRef.current!.style.transform = `perspective(${
                    cardImageRef.current!.clientWidth
                  }px) rotateX(${-mouseY / THRESHOLD}deg) rotateY(${
                    mouseX / THRESHOLD
                  }deg) scale3d(1, 1, 1)`;
                  shineRef.current!.style.background = `radial-gradient(circle at ${event.nativeEvent.offsetX}px ${event.nativeEvent.offsetY}px, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 100%)`;
                }}
                onMouseLeave={() => {
                  cardImageRef.current!.style.transform = `perspective(${cardImageRef.current!.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
                  shineRef.current!.style.transform = `perspective(${cardImageRef.current!.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
                  shineRef.current!.style.background = 'none';
                }}
              >
                <Image
                  className={`${!isOwned? 'grayscale' : ''}`}
                  ref={cardImageRef}
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
            )}
          </ModalBody>
          <ModalFooter className = 'bg-secondary'>
            <Button onClick={onDrawerOpen}>Show Stats</Button>
             {/* {!isOwned && <Button ml={2}>Trade For</Button>}  future work where it would display trade partners*/}
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
          <DrawerCloseButton className='bg-primary' />
          <DrawerHeader className='border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl'>Player Stats</DrawerHeader>
          <DrawerBody className='bg-secondary'>
            <IndexRecordTable
                  owned = {owned}
                  playerID = {playerID}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CardLightBoxModal;
