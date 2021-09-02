import MyCardsIcon from '@public/icons/my-cards-icon'
import OpenPacksIcon from '@public/icons/open-packs-icon'
import CommunityIcon from '@public/icons/community-icon'

const navigationOptions = [
  {
    href: '/dashboard',
    tab: 0,
    label: 'Dashboard',
    icon: CommunityIcon,
  },
  {
    href: '/collection',
    tab: 1,
    label: 'Collection',
    icon: MyCardsIcon,
  },
  {
    href: '/community',
    tab: 2,
    label: 'Community',
    icon: CommunityIcon,
  },
  {
    href: '/pack-shop',
    tab: 3,
    label: 'Pack Shop',
    icon: OpenPacksIcon,
  },
  {
    href: '/trade-hub',
    tab: 4,
    label: 'Trade Hub',
    icon: CommunityIcon,
  },
]

export default navigationOptions
