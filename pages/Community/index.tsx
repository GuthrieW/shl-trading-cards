import React, { useEffect, useState } from 'react'
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'
import Router from 'next/router'
import testUsers from '@utils/test-data/user.json'
import makeApiCall from '@pages/api/base'

const columns = [
  { id: 'username', label: 'Name', minWidth: 170 },
  { id: 'cards', label: 'Number of Cards', minWidth: 100 },
]

const Community = () => {
  const [communityAccounts, setCommunityAccounts] = useState([])

  useEffect(() => {
    // need to get all of the user accounts
    const response = makeApiCall({
      url: '',
      method: '',
    })
    setCommunityAccounts(testUsers.data)
  })

  const handleOnClick = (username) => {
    Router.push({
      pathname: `community/${username}`,
    })
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {communityAccounts.map((row, index) => {
              if (row.username === '') {
                return
              }
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={`${row.username}-${index}`}
                >
                  {columns.map((column, index) => {
                    const value =
                      column.id === 'cards'
                        ? row[column.id].length
                        : row[column.id]
                    return (
                      <TableCell
                        onClick={() => handleOnClick(row.username)}
                        key={`${column.id}-${index}`}
                      >
                        {value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default Community
