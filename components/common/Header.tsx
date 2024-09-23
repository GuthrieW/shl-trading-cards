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

const CURRENT_PAGE_LINK_CLASSES =
  'border-b-0 sm:border-b-[4px] border-l-[4px] sm:border-l-0 pt-0 sm:pt-[4px] pr-[14px] sm:pr-[10px] border-secondary'
const LINK_CLASSES =
  '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-secondary sm:h-full sm:w-max'

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
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
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

  console.log('uid', uid)

  return (
    <div className="flex flex-row justify-between px-[5%] h-16 bg-black text-grey100">
      <div className="relative flex flex-row">
        <Icon
          onClick={() => router.push('/')}
          boxSize={16}
          className="cursor-pointer transition-all"
        >
          <IceLevelLogo aria-label="Ice Level Homepage" />
        </Icon>
        <AuthGuard>
          <Link
            href={`/collect/${uid}`}
            className={classnames(
              '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-white hover:bg-blue600',
              linkClasses(router, `/collect/${uid}`)
            )}
          >
            Collect
          </Link>
        </AuthGuard>
        <Link
          href={`/community`}
          className={classnames(
            '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-white hover:bg-blue600',
            linkClasses(router, '/community')
          )}
        >
          Community
        </Link>
        <Link
          href="/shop"
          className={classnames(
            '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-white hover:bg-blue600',
            linkClasses(router, '/shop')
          )}
        >
          Shop
        </Link>
        <AuthGuard>
          <Link
            href="/trade"
            className={classnames(
              '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-white hover:bg-blue600',
              linkClasses(router, '/trade')
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
      <div className="flex flex-row items-center">
        <ColorModeSwitcher className="mr-1 !text-grey100 hover:!text-grey900 md:mr-2" />
        {showAuthButtons && (
          <AuthGuard
            fallback={
              <Button className="mx-2" onClick={() => router.push('/login')}>
                Log In
              </Button>
            }
          >
            <Menu isLazy>
              {({ isOpen }) => (
                <>
                  <MenuButton className="font-mont !text-white hover:underline">
                    <div className="flex h-full items-center space-x-1">
                      <span className="hidden sm:inline !text-white">
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
                    <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          </AuthGuard>
        )}
      </div>
    </div>
  )
}
