import { FilterFn } from '@tanstack/react-table'
import fuzzysort from 'fuzzysort'
import { deburr } from 'lodash'

type FilterPart = {
  type: 'text'
  values: string
}

const parseFilters = (filter: string): FilterPart[] => {
  let textFilter = ''

  const filterParts: FilterPart[] = filter
    .split(' ')
    .flatMap((currFilterPart) => {
      const splitPart = currFilterPart.split(':')

      if (splitPart.length > 1) {
        const [, values] = splitPart
        const filterValues = values.split(',')
        if (filterValues.join('').length === 0) return []
      }
      return []
    })
  if (textFilter) {
    filterParts.unshift({
      type: 'text',
      values: textFilter,
    })
  }
  return filterParts
}

const THRESHOLD = -1000

export const tableGlobalFilterFn: FilterFn<any> = (row, value) => {
  const parsedFilters = parseFilters(value)

  const textFilter = parsedFilters.find(
    (filter) => filter.type === 'text'
  ) as Extract<FilterPart, { type: 'text' }>

  const nameResult = textFilter
    ? fuzzysort.single(textFilter.values, row.original.name) ?? {
        score: -Infinity,
      }
    : {
        // If we don't have a text filter we should still return all
        score: THRESHOLD + 1,
      }

  return nameResult.score > THRESHOLD
}

export const simpleGlobalFilterFn: FilterFn<any> = (
  row,
  columnId,
  filterValue
) => {
  const safeValue = String(
    (() => {
      const value = row.getValue(columnId)
      return typeof value === 'number' ? String(value) : value
    })()
  )

  const columnsToDeburr = ['name']

  const deburredValue = columnsToDeburr.includes(columnId)
    ? deburr(safeValue)
    : safeValue

  return (
    safeValue.toLowerCase().includes(filterValue.toLowerCase()) ||
    deburredValue.toLowerCase().includes(filterValue.toLowerCase())
  )
}
