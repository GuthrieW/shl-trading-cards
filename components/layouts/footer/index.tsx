import React from 'react'

const Footer = () => (
  <footer className="invisible md:visible fixed bottom-0 w-full h-16 bg-neutral-800 text-gray-100 flex justify-center items-center">
    <div className="text-xs active:hover:visited:bg-gray-100">
      &copy; {new Date().getFullYear()} |{' '}
      <span>Made with ♥︎ by the SHL Dev Team | </span>
      <a
        href="https://simulationhockey.com/index.php"
        rel="noreferrer"
        target="_blank"
      >
        Visit Forum
      </a>{' '}
      |{' '}
      <a href="#" rel="noreferrer" target="_blank">
        Report a Bug
      </a>{' '}
    </div>
  </footer>
)

export default Footer
