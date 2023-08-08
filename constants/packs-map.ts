export type PackInfo = {
  id: string
  label: string
  description: string
  imageUrl: string
  price: number
  priceLabel: string
}

export const packsMap = {
  base: {
    id: 'base',
    label: 'Base',
    description:
      'The base trading card pack. Contains 6 cards ranging from Bronze to Hall of Fame rarity.',
    imageUrl: '/images/base-pack-cover.png',
    price: 50000,
    priceLabel: '50k',
  },
}

export const packCovers = {
  base: {
    old: '/images/base-pack-cover.png',
    cgy: '/images/base-pack-cgy.png',
    min: '/images/base-pack-min.png',
    tex: '/images/base-pack-tex.png',
    tor: '/images/base-pack-tor.png',
  },
}

export const basePackCovers = [
  packCovers.base.cgy,
  packCovers.base.min,
  packCovers.base.tex,
  packCovers.base.tor,
]

export const getBasePackCover = () =>
  basePackCovers[Math.floor(Math.random() * basePackCovers.length)]

export const packs: PackInfo[] = [
  {
    id: packsMap.base.id,
    label: packsMap.base.label,
    description: packsMap.base.description,
    imageUrl: packsMap.base.imageUrl,
    price: packsMap.base.price,
    priceLabel: packsMap.base.priceLabel,
  },
]

export default packsMap
