import React from 'react'

interface FilterChip {
  id: string
  label: string
  type: 'team' | 'rarity' | 'subType'
}

interface ActiveFiltersProps {
  teams: string[]
  rarities: string[]
  subTypes: string[]
  teamData?: Array<{ id: number; name: string; league: number }>
  rarityData?: Array<{ card_rarity: string }>
  subTypeData?: Array<{ sub_type: string }>
  onToggleTeam: (teamId: string) => void
  onToggleRarity: (rarity: string) => void
  onToggleSubType: (subType: string) => void
  onClearAll: () => void
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  teams,
  rarities,
  subTypes,
  teamData = [],
  rarityData = [],
  subTypeData = [],
  onToggleTeam,
  onToggleRarity,
  onToggleSubType,
  onClearAll,
}) => {
  const filterChips: FilterChip[] = [
    ...teams.map((teamKey) => {
      const [leagueStr, idStr] = teamKey.split('-')
      const teamName =
        teamData.find(
          (t) => t.league === Number(leagueStr) && t.id === Number(idStr)
        )?.name || teamKey

      return {
        id: teamKey,
        label: teamName,
        type: 'team' as const,
      }
    }),
    ...rarities.map((r) => ({
      id: r,
      label: rarityData.find((rd) => rd.card_rarity === r)?.card_rarity || r,
      type: 'rarity' as const,
    })),
    ...subTypes.map((s) => ({
      id: s,
      label: subTypeData.find((sd) => sd.sub_type === s)?.sub_type || s,
      type: 'subType' as const,
    })),
  ]

  const handleRemove = (chip: FilterChip) => {
    const handlers = {
      team: onToggleTeam,
      rarity: onToggleRarity,
      subType: onToggleSubType,
    }
    handlers[chip.type](chip.id)
  }

  if (filterChips.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-secondary rounded-lg mb-6 relative z-0">
      <span className="text-sm font-medium">Active Filters:</span>

      {filterChips.map((chip) => (
        <div
          key={`${chip.type}-${chip.id}`}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue600 text-white text-xs md:text-sm rounded-full font-medium"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => handleRemove(chip)}
            className="w-[18px] h-[18px] flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-base leading-none"
            aria-label={`Remove ${chip.label} filter`}
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={onClearAll}
        className="px-3 py-1.5 bg-red200 text-black rounded-md text-sm font-semibold hover:bg-red200/50 transition-colors"
      >
        Clear All
      </button>
    </div>
  )
}

export default ActiveFilters
