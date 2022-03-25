import { NextSeo } from 'next-seo'
import React from 'react'

const Home = () => (
  <>
    <NextSeo title="Home" />
    <video
      className="fixed -z-10 top-0  opacity-75"
      autoPlay
      loop
      playsInline
      muted
    >
      <source src={'/videos/home-background.mp4'} type={'video/mp4'} />
    </video>
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="mt-5 text-3xl text-black font-bold">
        Welcome to SHL Trading Cards!
      </h1>
    </div>
  </>
)

export default Home
