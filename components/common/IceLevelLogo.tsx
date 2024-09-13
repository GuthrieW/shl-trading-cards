import Image from 'next/image'
import IceLevelSvg from 'public/images/ice-level.svg'

export const IceLevelLogo = ({ className }: { className?: string }) => {
  return <Image src={IceLevelSvg} alt="Ice Level Logo" className={className} />
}
