import { useEffect } from 'react'
import { toast } from 'react-toastify'

export type WarningToastProps = {
  warningText: string
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
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
      })
    }
  }, successDependencies)

  useEffect(() => {
    console.log('checking error toast')
    console.log(errorDependencies)
    if (errorDependencies.some((dependency) => dependency !== null)) {
      toast.error(errorText, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
      })
    }
  }, errorDependencies)
}

export const warningToast = ({ warningText }: WarningToastProps) => {
  toast.warning(warningText, {
    position: 'bottom-left',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    draggable: false,
  })
}

export default useToast
