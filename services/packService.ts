export type PackInfo = {
  id: string
  label: string
  description: string
  imageUrl: string
  price: number
  priceLabel: string
}

class PackService {
  readonly packs = {
    base: {
      id: 'base',
      label: 'Base',
      description:
        'The base trading card pack. Contains 6 cards ranging from Bronze to Hall of Fame rarity.',
      imageUrl: '/images/base-pack-cover.png',
      price: 50000,
      priceLabel: '50k',
      covers: [
        { name: 'old', url: '/base-pack-cover.png' },
        { name: 'cgy', url: '/base-pack-cgy.png' },
        { name: 'chi', url: '/base-pack-chi.png' },
        { name: 'min', url: '/base-pack-min.png' },
        { name: 'sfp', url: '/base-pack-sfp.png' },
        { name: 'tex', url: '/base-pack-tex.png' },
        { name: 'tor', url: '/base-pack-tor.png' },
        { name: 'meme', url: '/base-pack-meme.png' },
      ],
    },
  } as const

  basePackCover(): string {
    const minimum: number = 0
    const maximum: number = 100000
    const memeCoverChance: number =
      Math.floor(Math.random() * maximum - minimum + 1) + minimum
    if (memeCoverChance === 10) {
      return this.packs.base.covers.find(
        (packCover) => packCover.name === 'meme'
      ).url
    }

    const coverIndex: number = Math.floor(
      Math.random() * (Object.values(this.packs.base.covers).length -1)
    )
    return this.packs.base.covers.at(coverIndex).url
  }
}
export const packService = new PackService()
