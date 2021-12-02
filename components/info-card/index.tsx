import React from 'react'
import { Box, Card, CardContent, Typography } from '@material-ui/core'
import Link from 'next/link'

export type InfoCardProps = {
  title: string
  body: string
  onClick: Function
}

const InfoCard = ({ title, body, onClick }) => {
  return (
    <Box
      m={2}
      style={{
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" component="p">
            {body}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default InfoCard
