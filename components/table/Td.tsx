import { Skeleton } from '@chakra-ui/react'
import { Td as ChakraTd } from '@chakra-ui/react'

export default function Td({
  children,
  isLoading,
  ...rest
}: {
  children: React.ReactNode
  isLoading: boolean
} & React.ComponentProps<typeof ChakraTd>) {
  return (
    <ChakraTd {...rest}>
      <Skeleton isLoaded={!isLoading}>{children}</Skeleton>
    </ChakraTd>
  )
}
