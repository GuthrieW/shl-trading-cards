import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { Link } from './Link'
import { IceLevelLogo } from './IceLevelLogo'
import { useSession } from 'contexts/AuthContext'
import {
  Avatar,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import axios from 'axios'
import classnames from 'classnames'
import { query } from '@pages/api/database/query'
import { UserData } from '@pages/api/v3/user'
import { GET } from '@constants/http-methods'
import { ColorModeSwitcher } from '@components/ColorModeSwitcher'
import { useCookie } from '@hooks/useCookie'
import config from 'lib/config'
import { AuthGuard } from '@components/auth/AuthGuard'
import { Squash as Hamburger } from 'hamburger-react'

const CURRENT_PAGE_LINK_CLASSES =
  'border-b-0 sm:border-b-[4px] border-l-[4px] sm:border-l-0 pt-0 sm:pt-[4px] pr-[14px] sm:pr-[10px] border-secondary'
const LINK_CLASSES =
  '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max'

const linkClasses = (router: NextRouter, path: string): string =>
  classnames(
    router.asPath.startsWith(path) && CURRENT_PAGE_LINK_CLASSES,
    LINK_CLASSES
  )

const externalLinks = [
  {
    name: 'Forums',
    href: 'https://simulationhockey.com/index.php',
  },
  {
    name: 'Portal',
    href: 'https://portal.simulationhockey.com/',
  },
  {
    name: 'Index',
    href: 'https://Index.simulationhockey.com/',
  },
]

export const Header = ({ showAuthButtons = true }) => {
  const { session, loggedIn, handleLogout } = useSession()
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [uid] = useCookie(config.userIDCookieName)

  const router = useRouter()
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

  return (
    <div>
      <div className="z-50 h-16 w-full bg-black text-secondary">
        <div className="relative mx-auto flex h-full w-full items-center justify-between px-[5%] sm:w-11/12 sm:justify-start sm:p-0 lg:w-3/4">
          <Link
            href="/"
            className="order-2 m-0 h-full w-max transition-all sm:mx-2 sm:inline-block sm:h-full"
            aria-label="Go home"
          >
            <Icon
              onClick={() => router.push('/')}
              boxSize={16}
              className="cursor-pointer transition-all"
            >
              <IceLevelLogo aria-label="Ice Level Homepage" />
            </Icon>
          </Link>
          <div
            className={classnames(
              !drawerVisible && 'hidden',
              'absolute top-16 left-0 z-50 order-1 h-auto w-full flex-col bg-black sm:relative sm:top-0 sm:order-3 sm:flex sm:h-full sm:w-auto sm:flex-row sm:bg-[transparent]'
            )}
          >
            <AuthGuard>
              <Link
                href={`/collect/${uid}`}
                className={classnames(
                  '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-white hover:bg-blue600',
                  linkClasses(router, `/collect/${uid}`)
                )}
              >
                Collections
              </Link>
            </AuthGuard>
            <Link
              href={`/community`}
              className={classnames(
                '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-white hover:bg-blue600',
                linkClasses(router, `/community`)
              )}
            >
              Community
            </Link>
            <Link
              href="/shop"
              className={classnames(
                '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-white hover:bg-blue600',
                linkClasses(router, `/shop`)
              )}
            >
              Shop
            </Link>
            <AuthGuard>
              <Link
                href="/trade"
                className={classnames(
                  '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-white hover:bg-blue600',
                  linkClasses(router, `/trade`)
                )}
              >
                Trade
              </Link>
            </AuthGuard>
            <Menu>
              <MenuButton className="!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max">
                More
              </MenuButton>
              <MenuList>
                {externalLinks.map(({ name, href }) => (
                  <MenuItem
                    className="hover:!bg-highlighted/40 hover:!text-primary"
                    key={name}
                    as="a"
                    href={href}
                    target="_blank"
                  >
                    {name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                className={classnames(
                  '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-white hover:bg-blue600',
                  linkClasses(router, '/admin')
                )}
              >
                Admin
              </MenuButton>
              <MenuList>
                <MenuItem
                  className="hover:!bg-highlighted/40 hover:!text-primary"
                  onClick={() => router.push('/admin/cards')}
                >
                  Cards
                </MenuItem>
                <MenuItem
                  className="hover:!bg-highlighted/40 hover:!text-primary"
                  onClick={() => router.push('/admin/scripts')}
                >
                  Scripts
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
          <div className="inline-block flex-1 sm:hidden">
            <Hamburger
              toggled={drawerVisible}
              toggle={() => setDrawerVisible(!drawerVisible)}
              color="#F8F9FA"
              size={24}
            />
          </div>
          <div className="relative order-3 mr-4 flex flex-1 items-center justify-end space-x-3 sm:mr-[2%] sm:ml-auto sm:w-auto">
            <ColorModeSwitcher className="mr-1 !text-grey100 hover:!text-grey900 md:mr-2" />
            {!loggedIn && showAuthButtons && (
              <Button onClick={() => router.push('/login')}>Log In</Button>
            )}
            {loggedIn && showAuthButtons && (
              <Menu isLazy>
                {({ isOpen }) => (
                  <>
                    <MenuButton className="font-mont !text-white hover:underline">
                      <div className="flex h-full items-center space-x-1">
                        <span className="hidden sm:inline">
                          {user?.username}
                        </span>
                        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        <Avatar
                          size="sm"
                          name={user?.username}
                          src={user?.avatar}
                        />
                      </div>
                    </MenuButton>
                    <MenuList>
                      <MenuItem className="hover:!bg-highlighted/40 hover:!text-primary" onClick={handleLogout}>Sign Out</MenuItem>
                    </MenuList>
                  </>
                )}
              </Menu>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
