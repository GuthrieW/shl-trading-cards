import React from 'react'
import { Box, Card, CardContent, Typography } from '@material-ui/core'
import Link from 'next/link'

export type InfoCardProps = {
  title: string
  body: string
  href: string
}

const InfoCard = ({ title, body, href }) => (
  <Box
    m={2}
    style={{
      cursor: 'pointer',
    }}
  >
    <Link href={href}>
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
    </Link>
  </Box>
)

export default InfoCard
