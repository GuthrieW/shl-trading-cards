import IceLevelSvg from '/public/ice-level.svg'

export const IceLevelLogo = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => <IceLevelSvg {...props} />

// return (
//   <Image
//     onClick={onClick}
//     src={'/ice-level.svg'}
//     alt="Ice Level Logo"
//     className={className}
//   />
// )
