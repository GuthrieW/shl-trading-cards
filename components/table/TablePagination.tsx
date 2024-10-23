import { Box, IconButton } from '@chakra-ui/react'
import {
ArrowLeftIcon,
ArrowRightIcon,
ChevronLeftIcon,
ChevronRightIcon
} from '@chakra-ui/icons'
import { useEffect, useState } from 'react'

export default ({
  totalRows,
  rowsPerPage = 10,
  onPageChange,
}: {
  totalRows: number
  rowsPerPage: number
  onPageChange: (currentPage) => void
}) => {
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    onPageChange(currentPage)
  }, [currentPage])

  useEffect(() => {
    const newTotalPages = Math.ceil(totalRows / rowsPerPage)
    if (typeof totalRows !== 'undefined' && newTotalPages !== totalPages) {
      setTotalPages(newTotalPages)
      setCurrentPage(newTotalPages === 0 ? 0 : 1)
    }
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
    <Box className="flex flex-row justify-center itmes-center mt-6 mb-4">
      <IconButton
        onClick={goToFirstPage}
        className="mx-2 cursor-pointer"
        aria-label="go-to-first-page"
        icon={<ArrowLeftIcon />}
      />
      <IconButton
        onClick={goToPreviousPage}
        className="mx-2 cursor-pointer"
        aria-label="go-to-previous-page"
        icon={<ChevronLeftIcon fontSize="2xl" />}
      />
      <span className="flex justify-center items-center mx-2">
        {currentPage ?? 0} of {totalPages ?? 0}
      </span>
      <IconButton
        onClick={goToNextPage}
        className="mx-2 cursor-pointer"
        aria-label="go-to-next-page"
        icon={<ChevronRightIcon fontSize="2xl" />}
      />
      <IconButton
        onClick={goToLastPage}
        className="mx-2 cursor-pointer"
        aria-label="go-to-final-page"
        icon={<ArrowRightIcon />}
      />
    </Box>
  )
}
