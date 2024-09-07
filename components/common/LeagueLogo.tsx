import SHLSvg from 'public/images/shl.svg'
// import SMJHLSvg from 'public/images/smjhl.svg'

export const LeagueLogo = ({
  league = 'shl',
  ...props
}: React.SVGProps<SVGSVGElement> & { league: string }) => {
  switch (league) {
    case 'shl':
      return <SHLSvg {...props} />
    // case 'smjhl':
    //   return <SMJHLSvg {...props} />
    default:
      return <div />
  }
}
