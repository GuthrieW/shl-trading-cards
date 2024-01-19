import { useRouter } from 'next/router'
import Image from 'next/image'
import ShlSvg from 'public/images/shl.svg'

export const ShlLogo = () => {
  const router = useRouter()
  return (
    <Image
      className="cursor-pointer"
      src={ShlSvg}
      alt="Ice Level Logo"
      // onClick={() => router.push('/')}
      width={96}
      height={72}
    />
  )
}
