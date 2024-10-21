import { Link } from 'components/common/Link'
import React from 'react'
import Slider, { type Settings } from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { UserCollection } from '@pages/api/v3'
import pathToCards from '@constants/path-to-cards'
import Image from 'next/image'
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
      className: 'center',
      centerMode: true,
      infinite: true,
      centerPadding: '0',
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

    return (
      <div className="w-full carousel-container">
        <div className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
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
                      src={`${pathToCards}${card.imageURL}`}
                      width={300}
                      height={475}
                      alt={`Card ${card.cardID}`}
                      className="rounded-sm shadow-lg"
                      loading="lazy"
                      unoptimized
                    />
                    <div className="card-info">
                      <p>
                        Opened by: <GetUsername userID={card.userID} />
                      </p>
                      <Link
                        className="text-blue-600 "
                        href={`/packs/${card.packID}`}
                        target="_blank"
                      >
                        View Pack
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    )
  }
)
