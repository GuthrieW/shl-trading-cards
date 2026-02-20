export type Rarity = {
  label: string
  rarity: number
}

const rarityMap = {
  bronze: { label: 'Bronze', rarity: 4000 },
  silver: { label: 'Silver', rarity: 2750 },
  gold: { label: 'Gold', rarity: 1500 },
  draftNight: { label: 'Draft Night', rarity: 400 },
  ruby: { label: 'Ruby', rarity: 400 },
  logo: { label: 'Logo', rarity: 400 },
  diamond: { label: 'Diamond', rarity: 200 },
  award: { label: 'Awards', rarity: 100 },
  iihfAwards: { label: 'IIHF Awards', rarity: 65 },
  twoThousandClub: { label: '2000 TPE Club', rarity: 50 },
  specialEdition: { label: 'Special Edition', rarity: 50 },
  charity: { label: 'Charity', rarity: 35 },
  firstOverall: { label: '1st Overall', rarity: 35 },
  hallOfFame: { label: 'Hall of Fame', rarity: 15 },
  misprint: { label: 'Misprint', rarity: 0 },
} as const satisfies Record<string, Rarity>

const rarityMapRuby = {
  bronze: { label: 'Bronze', rarity: 3220 },
  silver: { label: 'Silver', rarity: 2200 },
  gold: { label: 'Gold', rarity: 1700 },
  draftNight: { label: 'Draft Night', rarity: 800 },
  ruby: { label: 'Ruby', rarity: 800 },
  logo: { label: 'Logo', rarity: 300 },
  diamond: { label: 'Diamond', rarity: 400 },
  award: { label: 'Awards', rarity: 200 },
  iihfAwards: { label: 'IIHF Awards', rarity: 100 },
  twoThousandClub: { label: '2000 TPE Club', rarity: 75 },
  specialEdition: { label: 'Special Edition', rarity: 75 },
  charity: { label: 'Charity', rarity: 50 },
  firstOverall: { label: '1st Overall', rarity: 50 },
  hallOfFame: { label: 'Hall of Fame', rarity: 30 },
  misprint: { label: 'Misprint', rarity: 0 },
} as const satisfies Record<string, Rarity>

export { rarityMap, rarityMapRuby }
