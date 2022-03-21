export type packInfo = {
  id: string
  label: string
  description: string
  imageUrl: string
}

export const packs: packInfo[] = [
  {
    id: 'base',
    label: 'Base',
    description:
      'The base trading card pack. Contains 6 cards ranging from bronze to diamond rarity.',
    imageUrl:
      'https://cdn.discordapp.com/attachments/806601618702336003/951970513830420550/unknown.png',
  },
]

export const packsMap = {
  base: {
    id: 'base',
    label: 'Base',
    description:
      'The base trading card pack. Contains 6 cards ranging from bronze to diamond rarity.',
    imageUrl:
      'https://cdn.discordapp.com/attachments/806601618702336003/951970513830420550/unknown.png',
  },
}

export default packsMap
