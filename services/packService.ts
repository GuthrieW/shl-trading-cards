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
        { name: 'old', url: '/images/base-pack-cover.png' },
        { name: 'cgy', url: '/images/base-pack-cgy.png' },
        { name: 'chi', url: '/images/base-pack-chi.png' },
        { name: 'min', url: '/images/base-pack-min.png' },
        { name: 'sfp', url: '/images/base-pack-sfp.png' },
        { name: 'tex', url: '/images/base-pack-tex.png' },
        { name: 'tor', url: '/images/base-pack-tor.png' },
        { name: 'meme', url: '/images/base-pack-meme.png' },
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
      Math.random() * Object.values(this.packs.base.covers).length
    )

    return this.packs.base.covers.at(coverIndex).url
  }
}
export const packService = new PackService()
