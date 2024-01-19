import { Link } from '@chakra-ui/react'
import React from 'react'

export const Footer = () => (
  <footer className="absolute bottom-0 flex h-16 w-full items-center justify-center bg-grey900 text-grey100">
    <div className="font-mont text-xs">
      &copy; {new Date().getFullYear()} |{' '}
      <span className="hidden sm:inline">
        Made with ♥︎ by the SHL Dev Team |{' '}
      </span>
      <Link href="https://simulationhockey.com/index.php" isExternal>
        Visit Forum
      </Link>{' '}
      |{' '}
      <Link href="https://forms.gle/5VZGGGuJB7SGCLSCA" isExternal>
        Report a Bug
      </Link>
    </div>
  </footer>
)
