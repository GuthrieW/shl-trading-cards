export type Rarity = {
  label: string
  value: string
  rarity: number
}

const rarityMap = {
  bronze: { label: 'Bronze', value: 'Bronze', rarity: 4245 },
  silver: { label: 'Silver', value: 'Silver', rarity: 2955 },
  gold: { label: 'Gold', value: 'Gold', rarity: 1500 },
  ruby: { label: 'Ruby', value: 'Ruby', rarity: 400 },
  diamond: { label: 'Diamond', value: 'Diamond', rarity: 200 },
  logo: { label: 'Logo', value: 'Logo', rarity: 400 },
  hallOfFame: { label: 'Hall of Fame', value: 'Hall of Fame', rarity: 15 },
  misprint: { label: 'Misprint', value: 'Misprint', rarity: 0 },
  charity: { label: 'Charity', value: 'Charity', rarity: 35 },
  award: { label: 'Awards', value: 'Awards', rarity: 100 },
  twoThousandClub: {
    label: '2000 TPE Club',
    value: '2000 TPE Club',
    rarity: 50,
  },
  firstOverall: { label: '1st Overall', value: '1st Overall', rarity: 35 },
  iihfAwards: { label: 'IIHF Awards', value: 'IIHF Awards', rarity: 65 },
} as const satisfies Record<string, Rarity>

export default rarityMap
