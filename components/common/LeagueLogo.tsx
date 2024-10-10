import Image from 'next/image'
import SHLSvg from 'public/images/shl.svg'
// import SMJHLSvg from 'public/images/smjhl.svg'

export const LeagueLogo = ({
  league = 'shl',
  className,
}: {
  league: string
  className: string
}) => {
  const { image, alt } = selectImageData(league)
  return <Image src={image} alt={alt} className={className} />
}

const selectImageData = (league: string) => {
  switch (league) {
    case 'shl':
      return { image: SHLSvg, alt: 'SHL Logo' }
    // case 'smjhl':
    //   return {image: SMJHLSvg, alt: SMJHL Logo }
    default:
      return null
  }
}
