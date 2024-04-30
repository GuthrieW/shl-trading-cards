import rarityMap from '@constants/rarity-map'

export const generateRarityCheckboxes = (
  updateButtonIdsHook
): CollectionTableButtons[] => {
  return Object.values(rarityMap).map(({ label }) => {
    let text: string = label
    if (label === 'Hall of Fame') text = 'HOF'
    if (label === '2000 TPE Club') text = '2K'
    if (label === '1st Overall') text = '1OA'
    if (label === 'IIHF Awards') text = 'IIHF'
    return {
      id: label,
      text,
      onClick: () => updateButtonIdsHook(label),
    }
  })
}
