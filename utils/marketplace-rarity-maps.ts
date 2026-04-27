export const RARITY_CONFIG: Record<
  string,
  { accent: string; glow: string; label: string }
> = {
  Bronze: { accent: '#c07830', glow: 'rgba(192,120,48,0.35)', label: 'Bronze' },
  Silver: { accent: '#5a5a71', glow: 'rgba(144,144,170,0.3)', label: 'Silver' },
  Gold: { accent: '#BD8700', glow: 'rgba(232,192,64,0.4)', label: 'Gold' },
  Logo: { accent: '#60b0ff', glow: 'rgba(96,176,255,0.35)', label: 'Logo' },
  Ruby: { accent: '#e03060', glow: 'rgba(224,48,96,0.35)', label: 'Ruby' },
  'Draft Night': {
    accent: '#50e0c0',
    glow: 'rgba(80,224,192,0.35)',
    label: 'Draft Night',
  },
  Diamond: {
    accent: '#459F94',
    glow: 'rgba(160,232,255,0.4)',
    label: 'Diamond',
  },
  Awards: { accent: '#078cba', glow: 'rgba(40,200,255,0.35)', label: 'Awards' },
  'IIHF Awards': {
    accent: '#078cba',
    glow: 'rgba(40,200,255,0.35)',
    label: 'IIHF Awards',
  },
  '2000 TPE Club': {
    accent: '#a040ff',
    glow: 'rgba(160,64,255,0.35)',
    label: '2000 TPE Club',
  },
  'Special Edition': {
    accent: '#ff8c00',
    glow: 'rgba(255,140,0,0.35)',
    label: 'Special Edition',
  },
  Charity: {
    accent: '#17733c',
    glow: 'rgba(64,224,128,0.35)',
    label: 'Charity',
  },
  '1st Overall': {
    accent: '#ff4040',
    glow: 'rgba(255,64,64,0.4)',
    label: '1st Overall',
  },
  'Hall of Fame': {
    accent: '#a97f00',
    glow: 'rgba(255,215,0,0.5)',
    label: 'Hall of Fame',
  },
}

export const DEFAULT_RARITY = {
  accent: '#9090aa',
  glow: 'rgba(144,144,170,0.3)',
  label: 'Card',
}
