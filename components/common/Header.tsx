import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from './Link'
import { LeagueLogo } from './LeagueLogo'
import classnames from 'classnames'
import { IceLevelLogo } from './IceLevelLogo'
import { useSession } from 'contexts/AuthContext'

export const Header = ({ showAuthButtons = true }) => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const { session, loggedIn, handleLogout } = useSession()
  const router = useRouter()

  return (
    <div>
      <div
        className="z-50 h-16 w-full bg-primary dark:bg-primaryDark"
        role="navigation"
        aria-label="Main"
      >
        <div className="relative mx-auto flex h-full w-full items-center justify-between px-[5%] sm:w-11/12 sm:justify-start sm:p-0 lg:w-3/4">
          <Link
            href="/"
            className="order-2 m-0 h-full w-max transition-all sm:mx-2 sm:inline-block sm:h-full"
            aria-label="Go home"
          >
            <IceLevelLogo className="relative top-[5%] h-[90%] sm:top-[2.5%]" />
          </Link>
        </div>
      </div>
    </div>
  )
}
