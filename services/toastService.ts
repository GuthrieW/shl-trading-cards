import { useToast, UseToastOptions } from '@chakra-ui/react'

export type ToastProps = {
  title: string
  description?: string
}

class ToastService {
  private readonly defaultToastOptions: Partial<UseToastOptions> = {
    duration: 2500,
    isClosable: true,
    position: 'bottom-left',
  }

  successToast = ({ title, description }: ToastProps) => {
    const toast = useToast()
    toast({
      title,
      description,
      status: 'success',
      ...this.defaultToastOptions,
    })
  }

  warningToast = ({ title, description }: ToastProps) => {
    const toast = useToast()
    toast({
      title,
      description,
      status: 'warning',
      ...this.defaultToastOptions,
    })
  }

  errorToast = ({ title, description }: ToastProps) => {
    const toast = useToast()
    toast({
      title,
      description,
      status: 'error',
      ...this.defaultToastOptions,
    })
  }
}

export const toastService = new ToastService()
