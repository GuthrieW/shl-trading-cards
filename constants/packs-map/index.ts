export type packInfo = {
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
    imageUrl:
      'https://cdn.discordapp.com/attachments/806601618702336003/951970513830420550/unknown.png',
    price: 100000,
    priceLabel: '100k',
  },
}

export const packs: packInfo[] = [
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
