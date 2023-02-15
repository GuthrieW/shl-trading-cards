import { useGetCurrentUser } from '@pages/api/queries'
import Header from '../header'
import { getUidFromSession } from '@utils/index'
import Router from 'next/router'
import ErrorModal from '@components/modals/error-modal'

const DefaultLayout = ({ children }) => {
  const { user, isLoading, isError } = useGetCurrentUser({
    uid: getUidFromSession(),
  })

  if (isLoading || isError) {
    return null
  }

  if (!user.uid) {
    return <ErrorModal title="Could not find user" subtitle="" />
  } else {
    return (
      <div className="h-full w-full">
        <Header user={user} />
        {children}
      </div>
    )
  }
}

export default DefaultLayout
