import IceLevelSvg from 'public/images/ice-level.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'

export const IceLevelLogo = () => {
  const router = useRouter()
  return (
    <Image
      className="cursor-pointer"
      src={IceLevelSvg}
      alt="Ice Level Logo"
      // onClick={() => router.push('/')}
      width={96}
      height={72}
    />
  )
}
