import rarityMap from '@constants/rarity-map'
import { iihfTeamsMap, shlTeamsMap } from '@constants/teams-map'

export const generateTeamCheckboxes = (
  updateButtonIdsHook,
  selectedRarities: string[]
): CollectionTableButtons[] => {
  if (selectedRarities.includes(rarityMap.iihfAwards.label)) {
    return Object.keys(iihfTeamsMap).map((key) => ({
      id: key,
      text: iihfTeamsMap[key].abbreviation,
      onClick: () => updateButtonIdsHook(key),
    }))
  } else {
    return Object.keys(shlTeamsMap).map((key) => ({
      id: key,
      text: shlTeamsMap[key].abbreviation,
      onClick: () => updateButtonIdsHook(key),
    }))
  }
}
