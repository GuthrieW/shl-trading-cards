import { useGetCurrentUser } from '@pages/api/queries'
import Footer from '../footer'
import Header from '../header'
import { getUidFromSession } from '@utils/index'
import Router from 'next/router'

const DefaultLayout = ({ children }) => {
  const { user, isLoading, isError } = useGetCurrentUser({
    uid: getUidFromSession(),
  })

  if (isLoading || isError) {
    return null
  }

  if (!user.uid) {
    Router.reload()
  } else {
    return (
      <div className="h-full w-full">
        <Header user={user} />
        {children}
        {/* Talk with Jess about the footer covering pages */}
        {/* <Footer /> */}
      </div>
    )
  }
}

export default DefaultLayout
