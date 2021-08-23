import MyCardsIcon from '@public/icons/my-cards-icon'
import OpenPacksIcon from '@public/icons/open-packs-icon'
import CommunityIcon from '@public/icons/community-icon'

const navigationOptions = [
  {
    href: '/collection/',
    tab: 0,
    label: 'Collection',
    icon: MyCardsIcon,
  },
  {
    href: '/community',
    tab: 1,
    label: 'Community',
    icon: CommunityIcon,
  },
  {
    href: '/pack-shop',
    tab: 2,
    label: 'Pack Shop',
    icon: OpenPacksIcon,
  },
  {
    href: '/trade-hub',
    tab: 3,
    label: 'Trade Hub',
    icon: null,
  },
]

export default navigationOptions
