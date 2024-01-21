import { Box, SimpleGrid } from '@chakra-ui/react'
import UserCard from '@components/v3/card/UserCard'

export default () => {
  return (
    <SimpleGrid className="w-full" spacing={'10px'} minChildWidth={'160px'}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
        <UserCard />
      ))}
    </SimpleGrid>
  )
}
