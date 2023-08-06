import rarityMap from '@constants/rarity-map'

export const generateRarityCheckboxes = (
  updateButtonIdsHook
): CollectionTableButtons[] => {
  return Object.values(rarityMap).map((rarity) => {
    let text = rarity.label
    if (text === 'Hall of Fame') text = 'HOF'
    if (text === '2000 TPE Club') text = '2K'
    return {
      id: rarity.label,
      text,
      onClick: () => updateButtonIdsHook(rarity.label),
    }
  })
}
