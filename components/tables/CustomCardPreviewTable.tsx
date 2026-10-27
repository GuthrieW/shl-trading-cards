import React, { useMemo } from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { TableHeader } from './TableHeader'
import { Table } from './Table'
import { CUSTOM_CARD_TABLE } from './tableBehaviorFlags'

const columnHelper = createColumnHelper<Partial<Card>>()

const col = (key: keyof Card, label: string) =>
  columnHelper.accessor(key, {
    header: () => <TableHeader title={key}>{label}</TableHeader>,
    cell: (props) => props.getValue() ?? '-',
    enableSorting: true,
  })

const CustomCardsPreviewTable = ({ cards }: { cards: Partial<Card>[] }) => {
  const columns = useMemo(
    () => [
      col('teamID', 'Team ID'),
      col('leagueID', 'League ID'),
      col('playerID', 'Player ID'),
      col('player_name', 'Player Name'),
      col('render_name', 'Render Name'),
      col('season', 'Season'),
      col('card_rarity', 'Rarity'),
      col('sub_type', 'Sub Type'),
      col('position', 'Pos'),
      col('overall', 'OVR'),
      col('skating', 'SKA'),
      col('shooting', 'SHO'),
      col('hands', 'HAN'),
      col('checking', 'CHK'),
      col('defense', 'DEF'),
      col('high_shots', 'High Shots'),
      col('low_shots', 'Low Shots'),
      col('quickness', 'Quickness'),
      col('control', 'Control'),
      col('conditioning', 'Cond'),
    ],
    []
  )

  const table = useReactTable({
    columns,
    data: cards,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <Table<Partial<Card>>
      table={table}
      tableBehavioralFlags={CUSTOM_CARD_TABLE}
    />
  )
}

export default CustomCardsPreviewTable
