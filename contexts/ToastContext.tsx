import { useToast, UseToastOptions } from '@chakra-ui/react'
import React, { createContext, useState, useEffect, ReactNode } from 'react'

interface ToastContextProps {
  addToast: (toast: UseToastOptions) => void
}

const ToastContext = createContext<ToastContextProps>({
  addToast: () => {},
})

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<UseToastOptions[]>([])
  const toast = useToast()

  const addToast = (newToast: UseToastOptions) =>
    setToasts([...toasts, newToast])

  useEffect(() => {
    if (toasts.length > 0) {
      const currentToast = toasts[0]
      toast(currentToast)
      setToasts((prevToasts) => prevToasts.slice(1))
    }
  }, [toasts, toast])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export { ToastProvider, ToastContext }
