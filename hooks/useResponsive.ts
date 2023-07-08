import { useEffect, useState } from 'react'

export const MOBILE_MAX_WIDTH = 640
export const TABLET_MAX_WIDTH = 768

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isTablet, setIsTablet] = useState<boolean>(false)
  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false)

  useEffect(() => {
    handleResize()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize, false)
  }, [])

  const handleResize = () => {
    if (window.innerWidth <= 640) {
      setIsMobile(true)
      setIsTablet(false)
      setIsDesktop(false)
      setIsLargeScreen(false)
      return
    }

    if (window.innerWidth <= 768) {
      setIsMobile(false)
      setIsTablet(true)
      setIsDesktop(false)
      setIsLargeScreen(false)
      return
    }

    if (window.innerWidth <= 1024) {
      setIsMobile(false)
      setIsTablet(false)
      setIsDesktop(true)
      setIsLargeScreen(false)
      return
    }

    setIsMobile(false)
    setIsTablet(false)
    setIsDesktop(false)
    setIsLargeScreen(true)
    return
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
  }
}
