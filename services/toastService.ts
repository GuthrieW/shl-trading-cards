import {
  CreateToastFnReturn,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react'

export type ToastProps = {
  title: string
  description?: string
}

class ToastService {
  private toast: CreateToastFnReturn = null
  private readonly defaultToastOptions: Partial<UseToastOptions> = {
    duration: 2500,
    isClosable: true,
    position: 'bottom-left',
  }
  constructor() {
    this.toast = useToast()
  }

  successToast = ({ title, description }: ToastProps) => {
    this.toast({
      title,
      description,
      status: 'success',
      ...this.defaultToastOptions,
    })
  }

  warningToast = ({ title, description }: ToastProps) => {
    this.toast({
      title,
      description,
      status: 'warning',
      ...this.defaultToastOptions,
    })
  }

  errorToast = ({ title, description }: ToastProps) => {
    this.toast({
      title,
      description,
      status: 'error',
      ...this.defaultToastOptions,
    })
  }
}

export const toastService = new ToastService()
