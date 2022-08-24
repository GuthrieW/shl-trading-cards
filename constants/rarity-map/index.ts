export type Rarity = {
  label: string
  value: string
  rarity: number
}

const rarityMap = {
  bronze: { label: 'Bronze', value: 'Bronze', rarity: 4450 }, // subtracted 50 for charity cards
  silver: { label: 'Silver', value: 'Silver', rarity: 2950 }, // subtracted 50 for charity cards
  gold: { label: 'Gold', value: 'Gold', rarity: 1500 },
  ruby: { label: 'Ruby', value: 'Ruby', rarity: 400 },
  diamond: { label: 'Diamond', value: 'Diamond', rarity: 135 },
  logo: { label: 'Logo', value: 'Logo', rarity: 450 },
  hallOfFame: { label: 'Hall of Fame', value: 'Hall of Fame', rarity: 15 },
  misprint: { label: 'Misprint', value: 'Misprint', rarity: 0 },
  charity: { label: 'Charity', value: 'Charity', rarity: 100 },
}

export default rarityMap
