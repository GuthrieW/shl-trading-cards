import getUidFromSession from '@utils/get-uid-from-session'
import { NextSeo } from 'next-seo'
import Router from 'next/router'
import React from 'react'

const homeBoxes = [
  {
    title: 'Buy Packs',
    href: '/pack-shop',
    content: '',
  },
  {
    title: 'View Your Collection',
    href: `/collection?uid=${getUidFromSession()}`,
    content: '',
  },
  {
    title: 'View Other Collections',
    href: '/community',
    content: '',
  },
]

const Home = () => (
  <>
    <NextSeo title="Home" />
    {/* Keeping the background video in here in case we ever want to bring it back */}
    {/* <video
      className="fixed -z-10 top-0  opacity-75"
      autoPlay
      loop
      playsInline
      muted
    >
      <source src={'/videos/home-background.mp4'} type={'video/mp4'} />
    </video> */}
    <div className="w-full h-full flex flex-col justify-center items-center">
      <img
        className="w-1/2"
        src="https://cdn.discordapp.com/attachments/806601618702336003/956337015400591400/why.png"
      />
      <div className="flex flex-row justify-center items-center">
        {homeBoxes.map((box, index) => (
          <div
            key={index}
            className="m-2 cursor-pointer"
            onClick={() => Router.push(box.href)}
          >
            <div>{box.title}</div>
            <div>{box.content}</div>
          </div>
        ))}
      </div>
    </div>
  </>
)

export default Home
