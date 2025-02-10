import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { packService } from 'services/packService'
import { UserPackWithCover } from '@pages/packs'
import Image from 'next/image'

type OpenPackModalProps = {
  onAccept: (packID: number) => void
  setShowModal: (show: boolean) => void
  pack: UserPackWithCover
  onError?: boolean
}

const getPackTypeData = (pack: UserPackWithCover) => {
  if (pack.packType === packService.packs.base.id) {
    return packService.packs.base
  }
  if (pack.packType === packService.packs.ruby.id) {
    return packService.packs.ruby
  }
}

const OpenPackModal = ({
  onAccept,
  setShowModal,
  pack,
  onError,
}: OpenPackModalProps) => {
  const [isOpening, setIsOpening] = useState(false)
  const packTypeData = getPackTypeData(pack)

  const handleOpenPack = () => {
    setIsOpening(true)
    onAccept(Number(pack.packID))
  }

  useEffect(() => {
    if (onError) {
      setIsOpening(false)
    }
  }, [onError])

  return (
    <Modal
      isOpen={true}
      blockScrollOnMount={false}
      onClose={() => setShowModal(false)}
    >
      <ModalOverlay />
      <ModalContent
        sx={{
          maxW: { base: '75%', sm: '60%', md: '40%', lg: '25%' },
        }}
      >
        <ModalBody className="flex flex-col justify-center items-center bg-primary text-secondary">
          <Image
            src={pack.cover}
            alt={packTypeData.label}
            className="select-none max-w-xs sm:max-w-sm"
            layout="responsive"
            width={600}
            height={800}
            style={{
              objectFit: 'contain',
              transform: 'scale(0.85)',
            }}
          />
          <Text mt={2} className="text-sm md:text-base">
            {packTypeData.description}
          </Text>
        </ModalBody>
        <ModalFooter className="flex justify-end bg-primary text-secondary">
          <Button
            variant="ghost"
            colorScheme="red"
            className="border-2 border-secondary"
            onClick={() => setShowModal(false)}
            mr={2}
            isDisabled={isOpening}
          >
            Open Later
          </Button>
          <Button
            colorScheme="green"
            onClick={handleOpenPack}
            isDisabled={isOpening}
            className={isOpening ? 'opacity-50' : ''}
          >
            {isOpening ? (
              <>
                {' '}
                <Spinner size="md" color="black" /> <div> Opening... </div>
              </>
            ) : (
              'Open Pack'
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default OpenPackModal
