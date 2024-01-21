import {
  Avatar,
  Box,
  Card,
  CardBody,
  HStack,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react'

export default function UserCard() {
  return (
    <Box borderWidth={'1px'} borderRadius={'lg'}>
      <Card className="max-w-64">
        <CardBody>
          <Avatar
            name="caltroit_red_flames"
            src={
              'https://simulationhockey.com' +
              '/uploads/avatars/avatar_2856.jpg?dateline=1542056791'
            }
          />
          <Stack>
            <StatGroup>
              <Stat>
                <StatLabel>Total Cards</StatLabel>
                <StatNumber>1000</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Unique Cards</StatLabel>
                <StatNumber>50</StatNumber>
              </Stat>
            </StatGroup>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  )
}
