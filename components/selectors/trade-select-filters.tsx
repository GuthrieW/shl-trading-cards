import DropdownWithCheckboxGroup from '@components/dropdowns/dropdown-with-checkbox-group'
import SearchBar from '@components/inputs/search-bar'
import { useResponsive } from '@hooks/useResponsive'
import React from 'react'

export type TradeSelectFiltersProps = {
  className?: string
  // username: string
  // updateUsername: (newUsername: string) => void
  statuses: TradeStatus[]
  updateStatuses: (newStatuses: TradeStatus[]) => void
  disabled: boolean
}

const statusMap: TradeStatus[] = [
  'COMPLETE',
  'PENDING',
  'DECLINED',
  'AUTO_DECLINED',
]

const TradeSelectFilters = ({
  className,
  // username,
  // updateUsername,
  statuses,
  updateStatuses,
  disabled,
}: TradeSelectFiltersProps) => {
  const updateSelectedTeamButtonIds = (toggleId) =>
    statuses.includes(toggleId)
      ? updateStatuses(statuses.filter((team) => team != toggleId))
      : updateStatuses(statuses.concat(toggleId))

  const statusCheckboxes: { id: string; text: string; onClick: () => void }[] =
    statusMap.map((key: TradeStatus) => {
      return {
        id: key,
        text: key,
        onClick: () => updateSelectedTeamButtonIds(key),
      }
    })

  return (
    <div
      className={`h-12 w-full flex flex-row justify-center items-center border-b-2 border-neutral-400 ${className}`}
    >
      {/* <SearchBar onChange={(event) => updateUsername(event.target.value)} /> */}
      <DropdownWithCheckboxGroup
        title="Trade Status"
        checkboxes={statusCheckboxes}
        selectedCheckboxIds={statuses}
        disabled={disabled}
      />
    </div>
  )
}

export default TradeSelectFilters
