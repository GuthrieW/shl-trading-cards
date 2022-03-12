import React from 'react'

type PaginationProps = {
  pageOptions: any
  pageIndex: number
  canNextPage: boolean
  nextPage: Function
  canPreviousPage: boolean
  previousPage: Function
  gotoPage: Function
  gotoLastPage: Function
}

const Pagination = ({
  pageOptions,
  pageIndex,
  canNextPage,
  nextPage,
  canPreviousPage,
  previousPage,
  gotoPage,
  gotoLastPage,
}: PaginationProps) => (
  <div className="flex flex-row justify-center items">
    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
      {'<<'}
    </button>
    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
      {'<'}
    </button>
    <div>
      <span>
        Page {pageIndex + 1} of {pageOptions.length}
      </span>
      <span>
        Go to page:
        <input
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            gotoPage(page)
          }}
        />
      </span>
    </div>
    <button onClick={() => nextPage()} disabled={!canNextPage}>
      {'>'}
    </button>
    <button onClick={() => gotoLastPage()} disabled={!canNextPage}>
      {'>>'}
    </button>
  </div>
)

export default Pagination
