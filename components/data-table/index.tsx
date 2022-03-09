import React, { useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { Search } from '@mui/icons-material'

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

const DataTable = ({ title, columns, data }: DataTableProps) => {
  const [tableData, setTableData] = useState(data)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)
  const [searchFor, setSearchFor] = useState<string>('')
  const [orderBy, setOrderby] = useState(null)
  const [order, setOrder] = useState<SortOrders>('asc')

  useEffect(() => {
    let newData = data
    if (searchFor !== '') {
      newData = newData.filter((user: User) =>
        user.username.toLowerCase().includes(searchFor.toLowerCase())
      )
    }

    if (orderBy) {
      // TODO: add table sorting
    }

    setTableData(newData)
  }, [searchFor, orderBy])

  const handleSortRequest = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'asc' : 'desc')
    setOrderby(property)
  }

  const createSortHandler = (property) => (event) => {
    handleSortRequest(event, property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleUpdateSearch = (event) => {
    console.log(event.target.value)
    setSearchFor(event.target.value)
  }

  const numberOfEmptyRows = new Array(
    Math.max(0, (1 + page) * rowsPerPage - tableData.length)
  ).fill('undefined')

  if (orderBy) {
    alert('Sorting is not supported yet')
  }

  return typeof window !== 'undefined' ? (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>{title}</Typography>
            <Box>
              <TextField
                onChange={handleUpdateSearch}
                InputProps={{
                  placeholder: 'Member Search...',
                  endAdornment: (
                    <InputAdornment position={'end'}>
                      <IconButton>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Toolbar>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column: Column) => (
                  <TableCell
                    key={column.field}
                    align={'left'}
                    sortDirection={orderBy === column.field ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={createSortHandler(column.field)}
                    >
                      {column.headerName}
                      {orderBy === column.field ? (
                        <Box>
                          {order === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: User) => (
                  <TableRow>
                    <TableCell>{row.uid}</TableCell>
                    <TableCell>{row.username}</TableCell>
                  </TableRow>
                ))}
              {numberOfEmptyRows.map((emptyRow) => (
                <TableRow>
                  <TableCell>{'\u00A0'}</TableCell>
                  <TableCell>{'\u00A0'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tableData.length}
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
