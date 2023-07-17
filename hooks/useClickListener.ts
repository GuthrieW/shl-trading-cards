import { MutableRefObject, useEffect } from 'react'

export const useClickListener = (
  elementRef: MutableRefObject<any>,
  onClick: () => void
) => {
  useEffect(() => {
    function handleClick(event) {
      if (elementRef.current && !elementRef.current.contains(event.target)) {
        onClick()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [elementRef])
}
