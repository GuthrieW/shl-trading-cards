import { UseToastOptions } from '@chakra-ui/react'

export const successToastOptions: Partial<UseToastOptions> = {
  status: 'success',
  duration: 2500,
  isClosable: true,
  position: 'bottom-left',
}

export const warningToastOptions: Partial<UseToastOptions> = {
  status: 'warning',
  duration: 2500,
  isClosable: true,
  position: 'bottom-left',
}

export const errorToastOptions: Partial<UseToastOptions> = {
  status: 'error',
  duration: 2500,
  isClosable: true,
  position: 'bottom-left',
}
