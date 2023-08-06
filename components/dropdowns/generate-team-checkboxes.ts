import teamsMap from '@constants/teams-map'

export const generateTeamCheckboxes = (
  updateButtonIdsHook
): CollectionTableButtons[] => {
  return Object.keys(teamsMap).map((key) => ({
    id: key,
    text: teamsMap[key].abbreviation,
    onClick: () => updateButtonIdsHook(key),
  }))
}
