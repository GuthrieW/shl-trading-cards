import { useGetCurrentUser } from '@pages/api/queries'
import Footer from '../footer'
import Header from '../header'
import { getUidFromSession } from '@utils/index'

const DefaultLayout = ({ children }) => {
  const { user, isLoading, isError } = useGetCurrentUser({
    uid: getUidFromSession(),
  })

  if (isLoading || isError) {
    return null
  }

  return (
    <div className="h-full w-full">
      <Header user={user} />
      {children}
      {/* Talk with Jess about the footer covering pages */}
      {/* <Footer /> */}
    </div>
  )
}

export default DefaultLayout
