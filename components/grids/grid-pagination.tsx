import React from 'react'
import {
  ChevronDoubleRightIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
} from '@heroicons/react/20/solid'

type PaginationProps = {
  updateCurrentPage: (newPageNumber: number) => void
  currentPage: number
  maxPages: number
}

const GridPagination = ({
  updateCurrentPage,
  currentPage,
  maxPages,
}: PaginationProps) => {
  const gotoNextPage = () => {
    if (currentPage === maxPages - 1) return
    updateCurrentPage(currentPage + 1)
  }

  const gotoPreviousPage = () => {
    if (currentPage === 0) return
    updateCurrentPage(currentPage - 1)
  }

  const gotoPage = (newPage) => {
    if (newPage >= maxPages || newPage < 0) return
    updateCurrentPage(newPage)
  }

  return (
    <div className="my-2 flex flex-row justify-center items">
      <button
        className="mx-1 w-8 h-8 hover:bg-gray-300 rounded-md cursor-pointer"
        onClick={() => gotoPage(0)}
      >
        <ChevronDoubleLeftIcon />
      </button>
      <button
        className="mx-1 w-8 h-8 hover:bg-gray-300 rounded-md cursor-pointer"
        onClick={gotoPreviousPage}
      >
        <ChevronLeftIcon />
      </button>
      <div className="flex justify-center items-center">
        <span className="mx-1">
          Page {currentPage + 1} of {maxPages} | Go to page:
        </span>
      </div>
      <button
        className="mx-1 w-8 h-8 hover:bg-gray-300 rounded-md cursor-pointer"
        onClick={gotoNextPage}
      >
        <ChevronRightIcon />
      </button>
      <button
        className="mx-1 w-8 h-8 hover:bg-gray-300 rounded-md cursor-pointer"
        onClick={() => gotoPage(maxPages - 1)}
      >
        <ChevronDoubleRightIcon />
      </button>
    </div>
  )
}

export default GridPagination
