import useGetCurrentUser from '@pages/api/queries/use-get-current-user'
import Header from './header'
import { getUidFromSession } from '@utils/index'
import ErrorModal from '@components/modals/error-modal'

const DefaultLayout = ({ children }) => {
  const { user, isLoading, isError } = useGetCurrentUser({
    uid: getUidFromSession(),
  })

  if (isLoading || isError) {
    return null
  }

  if (!user.uid) {
    let subtitle = ''
    if (getUidFromSession() === 2856) {
      subtitle =
        'Cal you need to run the tunnnel script to connect to the DB locally'
    }
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
