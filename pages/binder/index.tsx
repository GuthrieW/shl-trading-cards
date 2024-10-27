import { PageWrapper } from '@components/common/PageWrapper'
import BinderTables from '@components/tables/BinderTable'
import { useSession } from 'contexts/AuthContext'
import { Button, useDisclosure } from '@chakra-ui/react'
import CreateBinder from '@components/modals/CreateBinder'

const BinderPage = () => {
  const { loggedIn } = useSession()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <PageWrapper>
      <div className="border-b-8 border-b-blue700 bg-secondary p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-secondaryText sm:text-xl">
          Welcome to the SHL Binders
        </h1>
        {loggedIn && (
          <Button colorScheme="blue" onClick={onOpen} size="md">
            Create Binder
          </Button>
        )}
      </div>

      <CreateBinder isOpen={isOpen} onClose={onClose} />
      <BinderTables />
    </PageWrapper>
  )
}

export default BinderPage
