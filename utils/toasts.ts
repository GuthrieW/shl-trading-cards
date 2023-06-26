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
