import rarityMap from '@constants/rarity-map'

export const generateRarityCheckboxes = (
  updateButtonIdsHook
): CollectionTableButtons[] => {
  return Object.values(rarityMap).map((rarity) => {
    let text = rarity.label
    if (text === 'Hall of Fame') text = 'HOF'
    if (text === '2000 TPE Club') text = '2K'
    if (text === '1st Overall') text = '1OA'
    return {
      id: rarity.label,
      text,
      onClick: () => updateButtonIdsHook(rarity.label),
    }
  })
}
