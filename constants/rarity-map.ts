export type Rarity = {
  label: string;
  value: string;
  rarity: number;
};

const rarityMap = {
  bronze: { label: 'Bronze', value: 'Bronze', rarity: 4245 },
  silver: { label: 'Silver', value: 'Silver', rarity: 2955 },
  gold: { label: 'Gold', value: 'Gold', rarity: 1500 },
  ruby: { label: 'Ruby', value: 'Ruby', rarity: 400 },
  logo: { label: 'Logo', value: 'Logo', rarity: 400 },
  diamond: { label: 'Diamond', value: 'Diamond', rarity: 200 },
  award: { label: 'Awards', value: 'Awards', rarity: 100 },
  twoThousandClub: { label: '2000 TPE Club', value: '2000 TPE Club', rarity: 50 },
  iihfAwards: { label: 'IIHF Awards', value: 'IIHF Awards', rarity: 65 },
  charity: { label: 'Charity', value: 'Charity', rarity: 35 },
  firstOverall: { label: '1st Overall', value: '1st Overall', rarity: 35 },
  hallOfFame: { label: 'Hall of Fame', value: 'Hall of Fame', rarity: 15 },
  misprint: { label: 'Misprint', value: 'Misprint', rarity: 0 },
} as const satisfies Record<string, Rarity>;

const rarityMapRubyPlus = {
  bronze: { label: 'Bronze', value: 'Bronze', rarity: 0 },
  silver: { label: 'Silver', value: 'Silver', rarity: 0 },
  gold: { label: 'Gold', value: 'Gold', rarity: 0 },
  ruby: { label: 'Ruby', value: 'Ruby', rarity: 4000 },
  logo: { label: 'Logo', value: 'Logo', rarity: 1800 },
  diamond: { label: 'Diamond', value: 'Diamond', rarity: 2000 },
  award: { label: 'Awards', value: 'Awards', rarity: 700 },
  twoThousandClub: { label: '2000 TPE Club', value: '2000 TPE Club', rarity: 500 },
  iihfAwards: { label: 'IIHF Awards', value: 'IIHF Awards', rarity: 500 },
  charity: { label: 'Charity', value: 'Charity', rarity: 200 },
  firstOverall: { label: '1st Overall', value: '1st Overall', rarity: 200 },
  hallOfFame: { label: 'Hall of Fame', value: 'Hall of Fame', rarity: 100 },
  misprint: { label: 'Misprint', value: 'Misprint', rarity: 0 },
} as const satisfies Record<string, Rarity>;

export { rarityMap, rarityMapRubyPlus };