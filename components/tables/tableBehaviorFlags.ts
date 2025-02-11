export const getPlayerTableBehavioralFlags = (
  isPaginated: boolean
): TableBehavioralFlags => ({
  stickyFirstColumn: true,
  showTableFooter: false,
  enablePagination: isPaginated,
  enableFiltering: true,
  showTableFilterOptions: false,
})

export const BINDER_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: false,
  showTableFooter: false,
  enablePagination: true,
  enableFiltering: true,
  showTableFilterOptions: false,
}

export const CARDS_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: false,
  showTableFooter: false,
  enablePagination: true,
  enableFiltering: true,
  showTableFilterOptions: false,
}

export const HOME_CARDS_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: false,
  showTableFooter: false,
  enablePagination: false,
  enableFiltering: true,
  showTableFilterOptions: false,
}

export interface TableBehavioralFlags {
  stickyFirstColumn: boolean
  showTableFooter: boolean
  enablePagination: boolean
  enableFiltering: boolean
  showTableFilterOptions: boolean
}
