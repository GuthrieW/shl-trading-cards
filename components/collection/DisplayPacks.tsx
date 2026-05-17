import {
  Image,
  SimpleGrid,
  Spinner,
  Button,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  useDisclosure,
  IconButton,
  Flex,
} from '@chakra-ui/react'
import React, { useState, useMemo, useCallback } from 'react'
import axios from 'axios'
import { query } from '@pages/api/database/query'
import { GET } from '@constants/http-methods'
import PackOpen from '@components/collection/PackOpen'
import { UserPacks } from '@pages/api/v3'
import { useRouter } from 'next/router'
import { packService } from 'services/packService'
import { ArrowBackIcon } from '@chakra-ui/icons'

interface DisplayPacksProps {
  userID: string
}

const DisplayPacks: React.FC<DisplayPacksProps> = React.memo(({ userID }) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedPackID, setSelectedPackID] = useState<string | null>(null)

  const { payload: packs, isLoading: packsLoading } = query<UserPacks[]>({
    queryKey: ['latest-cards', userID],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/uid/latest-packs?userID=${userID}&limit=20`,
      }),
    enabled: !!userID && isOpen,
  })

  const openPackView = useCallback((packID: string) => {
    setSelectedPackID(packID)
  }, [])

  const handleClose = useCallback(() => {
    onClose()
    setSelectedPackID(null)
  }, [onClose])

  const handleBack = useCallback(() => {
    setSelectedPackID(null)
  }, [])

  const packImages = useMemo(
    () =>
      packs?.map((pack) =>
        pack.packType === 'base'
          ? packService.basePackCover()
          : '/ruby-pack-cover.png'
      ) || [],
    [packs]
  )

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme="teal"
        className="w-full !text-sm sm:!text-lg  sm:w-auto"
      >
        View Latest Packs
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={handleClose} size="lg">
        <DrawerOverlay />
        <DrawerContent className="!bg-primary !text-primary">
          <DrawerCloseButton />
          <DrawerHeader className="border-b border-gray-600">
            <Flex align="center" gap={2}>
              {selectedPackID && (
                <IconButton
                  aria-label="Back to packs"
                  icon={<ArrowBackIcon />}
                  size="sm"
                  className="!bg-primary !text-primary hover:!bg-secondary"
                  onClick={handleBack}
                />
              )}
              {selectedPackID ? 'Pack Details' : 'Your 20 Latest Packs'}
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            {selectedPackID ? (
              <>
                <div className="mb-3">
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => router.push(`/packs/${selectedPackID}`)}
                    width="full"
                  >
                    View Full Page
                  </Button>
                </div>
                <PackOpen packID={selectedPackID} viewCard={false} />
              </>
            ) : (
              <>
                {packsLoading ? (
                  <Spinner />
                ) : packs && packs.length > 0 ? (
                  <SimpleGrid columns={2} spacing={4}>
                    {packs.map((pack, index) => (
                      <div
                        key={pack.packID}
                        onClick={() => openPackView(pack.packID)}
                        className="
                          cursor-pointer
                          border border-white
                          rounded-md p-3
                          transition-all duration-200 ease-in-out
                          hover:scale-105 hover:border-blue700 hover:shadow-lg
                          active:scale-100
                        "
                      >
                        <Image src={packImages[index]} alt="Pack" mb={2} />

                        <div className="space-y-1">
                          <p className="text-sm">
                            Opened:{' '}
                            {new Date(pack.openDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm">
                            Purchased:{' '}
                            {new Date(pack.purchaseDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </SimpleGrid>
                ) : (
                  <div>No packs available.</div>
                )}
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
})

export default DisplayPacks
