import { useEffect, useRef } from 'react'

export type DrawerProps = {
  children: JSX.Element
  isOpen: boolean
  closeDrawer: () => void
}

const Drawer = ({ children, isOpen, closeDrawer }: DrawerProps) => {
  const drawerRef = useRef(null)
  useEffect(() => {
    function handleClickOutsideDrawer(event) {
      console.log('event', event)
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        closeDrawer()
      }
    }

    document.addEventListener('mousedown', handleClickOutsideDrawer)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutsideDrawer)
    }
  }, [drawerRef])

  return (
    <ul
      ref={drawerRef}
      className={`absolute top-0 left-0 text-lg p-4 w-60 h-screen bg-neutral-800 ease-in duration-200 transform  ${
        isOpen ? '' : '-translate-x-60'
      }`}
    >
      <button className="text-gray-100" onClick={() => closeDrawer()}>
        Close
      </button>
      {children}
    </ul>
  )
}

export default Drawer
