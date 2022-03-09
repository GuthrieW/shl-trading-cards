import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
} from '@mui/material'

export type Column = {
  field: string
  headerName: string
}

export type Data = any & {
  id: string
  name: string
}

export type DataTableProps = {
  title: any
  columns: Column[]
  data: Data[]
}

export type SortOrders = 'asc' | 'desc'

const EnhancedToolbar = (title) => {
  return (
    <Toolbar>
      <Typography>{title}</Typography>
    </Toolbar>
  )
}

const EnhancedHeader = () => {}

const EnhancedBody = () => {}

const DataTable = ({ title, columns, data }: DataTableProps) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [orderBy, setOrderby] = useState(null)
  const [order, setOrder] = useState<SortOrders>('asc')

  useEffect(() => {
    if (data.length > 0) {
      setOrderby(data[0].id)
    }
  })

  const handleSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'asc' : 'desc')
    setOrderby(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const numberOfEmptyRows = new Array(
    Math.max(0, (1 + page) * rowsPerPage - data.length)
  ).fill('undefined')

  console.log(data.slice(0, 10))

  return typeof window !== 'undefined' ? (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <Toolbar>
            <Typography>{title}</Typography>
          </Toolbar>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column: Column) => (
                  <TableCell
                    align={'left'}
                    sortDirection={orderBy === column.field ? order : false}
                  >
                    {column.headerName}
                    <TableSortLabel>
                      {/* {column?.label} */}
                      {/* {orderBy === column.id ? <Box></Box> : null} */}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: User) => (
                  <TableRow>
                    <TableCell>{row.uid}</TableCell>
                    <TableCell>{row.username}</TableCell>
                  </TableRow>
                ))}
              {numberOfEmptyRows.map((emptyRow) => (
                <TableRow>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  ) : null
}

export default DataTable
