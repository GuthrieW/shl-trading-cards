import { useToast } from '@chakra-ui/react'

export type ToastProps = {
  title: string
  description?: string
}

export const warningToast = ({ title, description }: ToastProps) => {
  const toast = useToast()
  toast({
    title,
    description,
    status: 'warning',
    duration: 2500,
    isClosable: true,
    position: 'bottom-left',
  })
}

export const successToast = ({ title, description }: ToastProps) => {
  console.log('successToast')
  const toast = useToast()
  toast({
    title,
    description,
    status: 'success',
    duration: 2500,
    isClosable: true,
    position: 'bottom-left',
  })
}

export const errorToast = ({ title, description }: ToastProps) => {
  const toast = useToast()
  toast({
    title,
    description,
    status: 'error',
    duration: 2500,
    isClosable: true,
    position: 'bottom-left',
  })
}
