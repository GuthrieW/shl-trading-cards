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
import _SortBy from 'lodash/sortBy'
import Router from 'next/router'

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
  data: User[]
}

export type SortOrders = 'asc' | 'desc'

const DataTable = ({ title, columns, data }: DataTableProps) => {
  const [tableData, setTableData] = useState<User[]>(data)
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
      newData = _SortBy(newData, (user) => user[orderBy])
    }

    setTableData(newData)
  }, [searchFor, orderBy])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeSort = (property) => (event, property) => {
    const newOrderIfSameProperty: SortOrders = order === 'asc' ? 'desc' : 'asc'
    orderBy === property ? setOrder(newOrderIfSameProperty) : setOrder('asc')
    setOrderby(property)
  }

  const handleChangeSearch = (event) => {
    setSearchFor(event.target.value)
  }

  const handleRowClick = (uid: number) => {
    Router.push({
      pathname: 'collection',
      query: { uid: uid },
    })
  }

  const numberOfEmptyRows = new Array(
    Math.max(0, (1 + page) * rowsPerPage - tableData.length)
  ).fill('undefined')

  return typeof window !== 'undefined' ? (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>{title}</Typography>
            <Box>
              <TextField
                onChange={handleChangeSearch}
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
                      onClick={() => {
                        handleChangeSort(column.field)
                      }}
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
                .map((user: User) => (
                  <TableRow
                    key={user.uid}
                    onClick={() => {
                      handleRowClick(user.uid)
                    }}
                  >
                    <TableCell>{user.uid}</TableCell>
                    <TableCell>{user.username}</TableCell>
                  </TableRow>
                ))}
              {numberOfEmptyRows.map((emptyRow, index) => (
                <TableRow key={index}>
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
