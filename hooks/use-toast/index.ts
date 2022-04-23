import { useEffect } from 'react'
import { toast } from 'react-toastify'

export type WarningToastProps = {
  warningText: string
}

export type SuccessToastProps = {
  successText: string
}

export type ErrorToastProps = {
  errorText: string
}

type UseToastProps = {
  successText: string
  successDependencies: any[]
  errorText: string
  errorDependencies: any[]
}

const useToast = ({
  successText,
  successDependencies,
  errorText,
  errorDependencies,
}: UseToastProps) => {
  useEffect(() => {
    if (successDependencies.every((dependency) => dependency === true)) {
      toast.success(successText, {
        position: 'bottom-left',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: false,
      })
    }
  }, successDependencies)

  useEffect(() => {
    if (
      errorDependencies.some(
        (dependency) => dependency !== null && dependency !== false
      )
    ) {
      toast.error(errorText, {
        position: 'bottom-left',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: false,
      })
    }
  }, errorDependencies)
}

export const warningToast = ({ warningText }: WarningToastProps) => {
  toast.warning(warningText, {
    position: 'bottom-left',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: false,
  })
}

export const successToast = ({ successText }: SuccessToastProps) => {
  toast.success(successText, {
    position: 'bottom-left',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: false,
  })
}

export const errorToast = ({ errorText }: ErrorToastProps) => {
  toast.error(errorText, {
    position: 'bottom-left',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: false,
  })
}

export default useToast
