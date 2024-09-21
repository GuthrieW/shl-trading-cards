import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Link } from './Link'
import { IceLevelLogo } from './IceLevelLogo'
import { useSession } from 'contexts/AuthContext'
import {
  Avatar,
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MoonIcon,
  SunIcon,
} from '@chakra-ui/icons'
import axios from 'axios'
import classnames from 'classnames'
import { query } from '@pages/api/database/query'
import { UserData } from '@pages/api/v3/user'
import { GET } from '@constants/http-methods'

const CURRENT_PAGE_LINK_CLASSES =
  'border-b-0 sm:border-b-[4px] border-l-[4px] sm:border-l-0 pt-0 sm:pt-[4px] pr-[14px] sm:pr-[10px] border-secondary dark:border-secondaryDark'
const LINK_CLASSES =
  '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-secondaryText dark:!text-secondaryTextDark hover:bg-borderblue dark:hover:bg-borderblueDark sm:h-full sm:w-max'

const linkClasses = (router: NextRouter, path: string): string =>
  classnames(
    router.asPath.startsWith(path) && CURRENT_PAGE_LINK_CLASSES,
    LINK_CLASSES
  )

export const Header = ({ showAuthButtons = true }) => {
  const { session, loggedIn, handleLogout } = useSession()
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)

  const router = useRouter()

  const { toggleColorMode } = useColorMode()
  const isDarkMode = useColorModeValue(false, true)

  const { payload: user } = query<UserData>({
    queryKey: ['baseUser', session?.token],
    queryFn: () =>
      axios({
        url: '/api/v3/user',
        method: GET,
        headers: { Authorization: `Bearer ${session?.token}` },
      }),
    enabled: loggedIn,
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }, [isDarkMode])

  const handleToggleDarkMode = () => {
    const newIsDarkMode: boolean = !isDarkMode
    toggleColorMode()
    localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light')
  }

  return (
    <div className="flex flex-row justify-between px-[5%] h-16">
      <div className="relative flex flex-row">
        <Icon
          onClick={() => router.push('/')}
          className="cursor-pointer m-0 h-full w-max transition-all sm:mx-2 sm:inline-block sm:h-full"
        >
          <IceLevelLogo
            aria-label="Ice Level Homepage"
            className="relative top-[5%] h-[500%] sm:top-[2.5%] w-16"
          />
        </Icon>
        <Link href="/collect" className={linkClasses(router, '/collect')}>
          Collections
        </Link>
        <Link href="/shop" className={linkClasses(router, '/shop')}>
          Shop
        </Link>
        <Link href="/trade" className={linkClasses(router, '/trade')}>
          Trade
        </Link>
        <Menu>
          <MenuButton className={linkClasses(router, '/more')}>More</MenuButton>
          <MenuList>
            <MenuItem
              onClick={() => router.push('https://www.simulationhockey.com')}
            >
              Forums
            </MenuItem>
            <MenuItem
              onClick={() => router.push('https://index.simulationhockey.com')}
            >
              Index
            </MenuItem>
            <MenuItem
              onClick={() => router.push('https://portal.simulationhockey.com')}
            >
              Portal
            </MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton className={linkClasses(router, '/admin')}>
            Admin
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => router.push('/admin/cards')}>
              Cards
            </MenuItem>
            <MenuItem onClick={() => router.push('/admin/scripts')}>
              Scripts
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div className="flex flex-row items-center">
        <ColorModeSwitcher className="mr-1 !text-grey100 hover:!text-grey900 md:mr-2" />
        {!loggedIn && showAuthButtons && (
          <Button className="mx-2" onClick={() => router.push('/login')}>
            Log In
          </Button>
        )}
        {loggedIn && showAuthButtons && (
          <Menu isLazy>
            {({ isOpen }) => (
              <>
                <MenuButton className="font-mont text-secondaryText hover:underline dark:text-secondaryTextDark">
                  <div className="flex h-full items-center space-x-1">
                    <span className="hidden sm:inline">{user?.username}</span>
                    {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    <Avatar
                      size="sm"
                      name={user?.username}
                      src={user?.avatar}
                    />
                  </div>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        )}
      </div>
    </div>
    // <div
    //   className="z-50 h-16 w-full flex flex-row justify-center bg-primary dark:bg-primaryDark"
    //   role="navigation"
    //   aria-label="Header"
    // >
    //   <div className="flex flex-row m-0 h-full w-full transition-all px-[5%]">
    //     <Link href="/" aria-label="Ice Level Homepage">
    //       <IceLevelLogo className="top-[5%] h-[90%] w-auto sm:top-[2.5%] " />
    //     </Link>
    //     <div className="relative flex flex-row">
    //       <Link href="/collect" className={linkClasses(router, '/collect')}>
    //         Collect
    //       </Link>
    //       <Link href="/shop" className={linkClasses(router, '/shop')}>
    //         Shop
    //       </Link>
    //       <Link href="/trade" className={linkClasses(router, '/trade')}>
    //         Trade
    //       </Link>
    //       <Menu>
    //         <MenuButton className={linkClasses(router, '/more')}>
    //           More
    //         </MenuButton>
    //         <MenuList>
    //           <MenuItem
    //             onClick={() => router.push('https://www.simulationhockey.com')}
    //           >
    //             Forums
    //           </MenuItem>
    //           <MenuItem
    //             onClick={() =>
    //               router.push('https://index.simulationhockey.com')
    //             }
    //           >
    //             Index
    //           </MenuItem>
    //           <MenuItem
    //             onClick={() =>
    //               router.push('https://portal.simulationhockey.com')
    //             }
    //           >
    //             Portal
    //           </MenuItem>
    //         </MenuList>
    //       </Menu>
    //       <Menu>
    //         <MenuButton className={linkClasses(router, '/admin')}>
    //           Admin
    //         </MenuButton>
    //         <MenuList>
    //           <MenuItem onClick={() => router.push('/admin/cards')}>
    //             Cards
    //           </MenuItem>
    //           <MenuItem onClick={() => router.push('/admin/scripts')}>
    //             Scripts
    //           </MenuItem>
    //         </MenuList>
    //       </Menu>
    //     </div>
    //   </div>

    //   <div className="flex flex-row justify-end items-center h-full w-full px-[5%]">
    //     <div className="flex flex-row">
    //       <IconButton
    //         className="mx-2"
    //         aria-label={`Toggle Dark Mode`}
    //         icon={
    //           localStorage.getItem('theme') === 'dark' ? (
    //             <SunIcon />
    //           ) : (
    //             <MoonIcon />
    //           )
    //         }
    //         onClick={handleToggleDarkMode}
    //         variant="ghost"
    //         color="white"
    //       />
    //       {!loggedIn && showAuthButtons && (
    //         <Button className="mx-2" onClick={() => router.push('/login')}>
    //           Log In
    //         </Button>
    //       )}
    //       {loggedIn && showAuthButtons && (
    //         <Menu isLazy>
    //           {({ isOpen }) => (
    //             <>
    //               <MenuButton className="font-mont text-secondaryText hover:underline dark:text-secondaryTextDark">
    //                 <div className="flex h-full items-center space-x-1">
    //                   <span className="hidden sm:inline">{user?.username}</span>
    //                   {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
    //                   <Avatar
    //                     size="sm"
    //                     name={user?.username}
    //                     src={user?.avatar}
    //                   />
    //                 </div>
    //               </MenuButton>
    //               <MenuList>
    //                 <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
    //               </MenuList>
    //             </>
    //           )}
    //         </Menu>
    //       )}
    //     </div>
    //   </div>
    // </div>
  )
}
