import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import { GET } from '@constants/http-methods'
import { useCookie } from '@hooks/useCookie'
import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import axios from 'axios'
import { ToastContext } from 'contexts/ToastContext'
import config from 'lib/config'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useQuery } from 'react-query'

export default () => {
  const router = useRouter()
  const { addToast } = useContext(ToastContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedUser, setSelectedUser] = useState<string>(null)

  useRedirectIfNotAuthenticated()

  const tradePartnerUid = router.query.uid as string

  const [uid] = useCookie(config.userIDCookieName)
  console.log('uid', uid)

  if (tradePartnerUid === uid) {
    addToast({
      title: 'Ineligible Trade Partner',
      description: 'You cannot trade with yourself',
      status: 'warning',
    })
    router.replace('/trade')
    return
  }

  const { data: currentUserCards, isLoading: currentUserCardsIsLoading } =
    useQuery<{ cards: Card[] }>({
      queryKey: ['collection', uid],
      queryFn: () =>
        axios({
          url: `api/v3/cards/${uid}`,
          method: GET,
        }),
    })

  const { data: tradePartnerCards, isLoading: tradePartnerCardsIsLoading } =
    useQuery<{ cards: Card[] }>({
      queryKey: ['collection', tradePartnerUid],
      queryFn: () =>
        axios({
          url: `api/v3/cards/${tradePartnerUid}`,
          method: GET,
        }),
    })

  const openDrawer = (selectedUser: string) => {
    setSelectedUser(selectedUser)
    onOpen()
  }

  return (
    <PageWrapper>
      <Button onClick={() => openDrawer(uid)}>Open My Cards</Button>
      <Button onClick={() => openDrawer(tradePartnerUid)}>
        Open Other Cards
      </Button>
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader className="flex flex-row justify-between items-center">
            <span>{selectedUser}'s Cards</span>
            <Button onClick={onClose}>Close</Button>
          </DrawerHeader>
          <DrawerBody></DrawerBody>
        </DrawerContent>
      </Drawer>
    </PageWrapper>
  )
}