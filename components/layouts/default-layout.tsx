import useGetCurrentUser from '@pages/api/queries/use-get-current-user'
import Header from './header'
import getUidFromSession from '@utils/get-uid-from-session'
import isAdminOrCardTeam from '@utils/user-groups/is-admin-or-card-team'
import ErrorModal from '@components/modals/error-modal'
import MobileHeader from './mobile-header'
import { useResponsive } from '@hooks/useResponsive'
import { HeaderLink } from './index.d'
import {
  ChatAlt2Icon,
  CogIcon,
  CurrencyDollarIcon,
  DocumentAddIcon,
  DuplicateIcon,
  HomeIcon,
  PlayIcon,
  UsersIcon,
} from '@heroicons/react/outline'

const headersLinks: HeaderLink[] = [
  {
    icon: <HomeIcon />,
    headerText: 'Home',
    href: '/home',
    requireCardTeam: false,
    hide: false,
  },
  {
    icon: <UsersIcon />,
    headerText: 'Community',
    href: '/community',
    requireCardTeam: false,
    hide: false,
  },
  {
    icon: <DuplicateIcon />,
    headerText: 'Collection',
    href: `/collection?uid=${getUidFromSession()}`,
    requireCardTeam: false,
    hide: false,
  },
  {
    icon: <CurrencyDollarIcon />,
    headerText: 'Pack Shop',
    href: '/pack-shop',
    requireCardTeam: false,
    hide: false,
  },
  {
    icon: <DocumentAddIcon />,
    headerText: 'Open Packs',
    href: '/open-packs',
    requireCardTeam: false,
    hide: false,
  },
  {
    icon: <ChatAlt2Icon />,
    headerText: 'Trade Hub',
    href: '/trade-hub',
    requireCardTeam: false,
    hide: false,
  },
  {
    icon: <PlayIcon />,
    headerText: 'Ultimate Team',
    href: '/ultimate-team',
    requireCardTeam: false,
    hide: true,
  },
  {
    icon: <CogIcon />,
    headerText: 'Admin',
    href: '/admin',
    requireCardTeam: true,
    hide: false,
  },
]

const DefaultLayout = ({ children }) => {
  const { isDesktop } = useResponsive()
  const { user, isLoading, isError } = useGetCurrentUser({
    uid: getUidFromSession(),
  })

  const userIsAdminOrCardTeam = isAdminOrCardTeam(user)
  const filteredLinks = headersLinks.filter((link) => {
    if (link.requireCardTeam) return userIsAdminOrCardTeam
    return !link.hide
  })

  if (isLoading || isError) {
    return null
  }

  if (!user.uid) {
    return <ErrorModal title="Could not find user" subtitle="" />
  }

  return (
    <div className="h-full w-full">
      {isDesktop ? (
        <Header headerItems={filteredLinks} user={user} />
      ) : (
        <MobileHeader headerItems={filteredLinks} user={user} />
      )}
      {children}
    </div>
  )
}

export default DefaultLayout
