import { Box, Icon, IconButton } from '@chakra-ui/react'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'

export default ({
  totalRows,
  rowsPerPage,
  onChange,
}: {
  totalRows: number
  rowsPerPage: number
  onChange: (currentPage) => void
}) => {
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    onChange(currentPage)
  }, [currentPage])

  useEffect(() => {
    setTotalPages(Math.ceil(totalRows / rowsPerPage))
    setCurrentPage(1)
  }, [totalRows, rowsPerPage])

  const goToFirstPage = () => {
    setCurrentPage(1)
  }
  const goToPreviousPage = () => {
    const newValue: number = currentPage - 1
    newValue < 1 ? setCurrentPage(1) : setCurrentPage(newValue)
  }

  const goToNextPage = () => {
    const newValue: number = currentPage + 1
    newValue > totalPages
      ? setCurrentPage(totalPages)
      : setCurrentPage(newValue)
  }

  const goToLastPage = () => {
    setCurrentPage(totalPages)
  }

  return (
    <Box className="flex flex-row justify-center itmes-center mt-6">
      <IconButton
        onClick={goToFirstPage}
        className="mx-2"
        aria-label="go-to-first-page"
        icon={<ChevronDoubleLeftIcon />}
      />
      <IconButton
        onClick={goToPreviousPage}
        className="mx-2"
        aria-label="go-to-previous-page"
        icon={<ChevronLeftIcon />}
      />
      <span className="flex justify-center items-center mx-2">
        {currentPage ?? 0} of {totalPages ?? 0}
      </span>
      <IconButton
        onClick={goToNextPage}
        className="mx-2"
        aria-label="go-to-next-page"
        icon={<ChevronRightIcon />}
      />
      <IconButton
        onClick={goToLastPage}
        className="mx-2"
        aria-label="go-to-final-page"
        icon={<ChevronDoubleRightIcon />}
      />
    </Box>
  )
}
