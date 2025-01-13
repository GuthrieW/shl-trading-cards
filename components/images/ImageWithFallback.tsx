import { useState, useEffect } from 'react'
import Image from 'next/image'

const ImageWithFallback = ({
  src,
  fallback = '/cardback.png',
  alt,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isError, setIsError] = useState(false)
  useEffect(() => {
    if (!src) {
      setCurrentSrc(fallback)
    } else {
      setCurrentSrc(src)
      setIsError(false)
    }
  }, [src, fallback])

  const handleError = () => {
    if (!isError) {
      setCurrentSrc(fallback)
      setIsError(true)
    }
  }

  return <Image alt={alt} src={currentSrc} onError={handleError} {...props} />
}

export default ImageWithFallback
