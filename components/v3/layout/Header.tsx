import {
  Avatar,
  Button,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { useSession } from '@hooks/useSession'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Squash as Hamburger } from 'hamburger-react'
import { ShlLogo } from '../logo/ShlLogo'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import classnames from 'classnames'
import { PermissionGuard } from '../auth/PermissionGuard'

const CURRENT_PAGE_LINK_CLASSES: HTMLDivElement['className'] =
  'border-b-0 sm:border-b-[4px] border-l-[4px] sm:border-l-0 pt-0 sm:pt-[4px] pr-[14px] sm:pr-[10px] border-grey100'
const LINK_CLASSES: HTMLDivElement['className'] =
  '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max'

export const Header = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const { session, isLoggedIn, handleLogout } = useSession()
  const router = useRouter()

  return <header></header>
}
