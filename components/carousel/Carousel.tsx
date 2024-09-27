import classnames from 'classnames'
import { Link } from 'components/common/Link'
import React, { useMemo } from 'react'
import Slider, { type Settings } from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { UserCollection } from '@pages/api/v3'
import pathToCards from '@constants/path-to-cards'
import Image from 'next/image';
import GetUsername from '@components/common/GetUsername'

export const Carousel = React.memo(
  ({
    cards,
    isLoading,
  }: {
    cards: UserCollection[]
    isLoading?: boolean
    noBottomBorder?: boolean
  }) => {
    const settings: Settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "0",
      slidesToShow: 3,
      speed: 500,
      focusOnSelect: true,
      autoplay: true,
      autoplaySpeed: 60000,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            arrows: false,
          },
        },
      ],
    }

    const customLoader = ({ src }: { src: string }) => {
      return `https://simulationhockey.com/tradingcards/${src}.png`;
    };

    return (
      <div className="w-full carousel-container">
        <div className='border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl'>
          Latest Cards Opened
        </div>

        {isLoading ? (
          <div className="flex py-2 px-0 sm:px-8">
            <div className="mr-0 w-full animate-pulse rounded-lg border bg-primary p-4 md:mr-2 md:w-1/2">
              <div className="mb-2 h-6 rounded bg-primary"></div>
              <div className="mb-2 h-12 rounded bg-primary"></div>
              <div className="mb-2 h-6 rounded bg-primary"></div>
            </div>
            <div className="hidden w-1/2 animate-pulse rounded-lg border bg-primary p-4  md:block">
              <div className="mb-2 h-6 rounded bg-primary"></div>
              <div className="mb-2 h-12 rounded bg-primary"></div>
              <div className="mb-2 h-6 rounded bg-primary"></div>
            </div>
          </div>
        ) : (
          <div className="px-0 sm:px-8 carousel-wrapper">
            <Slider {...settings}>
              {cards.map((card: UserCollection, index: number) => (
                <div key={card.cardID} className="px-2 card-slide">
                  <div className="card-wrapper">
                    <Image
                      loader={customLoader}
                      src={`${pathToCards}${card.cardID}.png`}
                      width={300}
                      height={475}
                      alt={`Card ${card.cardID}`}
                      className="rounded-sm shadow-lg"
                      loading="lazy"
                      unoptimized
                    />
                    <div className="card-info">
                      <p>Opened by: <GetUsername userID={card.userID} /></p>
                      <Link className = "text-blue-600 " href={`/packs/${card.packID}`} target="_blank">
                        View Pack
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
        <style jsx global>{`
          .carousel-container {
            padding: 40px 0;
          }
          .carousel-wrapper {
            max-width: 1200px;
            margin: 0 auto;
          }
          .slick-slide {
            transition: all 0.3s ease;
          }
          .slick-current {
            transform: scale(1.1);
            z-index: 1;
          }
          .slick-slide:not(.slick-current) {
            transform: scale(0.8) translateX(5%);
            opacity: 0.7;
          }
          .slick-slide:not(.slick-current) + .slick-slide:not(.slick-current) {
            transform: scale(0.8) translateX(-5%);
          }
          .card-wrapper {
            transition: all 0.3s ease;
            margin: 0 auto;
            max-width: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .slick-current .card-wrapper {
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
          }
          .card-slide {
            display: flex !important;
            justify-content: center;
            align-items: center;
            height: 600px;
          }
          .card-info {
            margin-top: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            text-align: center;
            width: 100%;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .slick-current .card-info {
            opacity: 1;
          }
        `}</style>
      </div>
    )
  }
)