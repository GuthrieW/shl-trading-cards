import { Link } from 'components/common/Link'
import React from 'react'
import Slider, { type Settings } from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { UserCollection } from '@pages/api/v3'
import pathToCards from '@constants/path-to-cards'
import Image from 'next/image'
import GetUsername from '@components/common/GetUsername'
import { Skeleton, SkeletonText, Stack } from '@chakra-ui/react'

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

    const loadingCards = Array(3).fill(null)

    return (
      <div className="w-full carousel-container">
        <div className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
          Latest Cards Opened
        </div>

        <div className="px-0 sm:px-8 carousel-wrapper">
          <Slider {...settings}>
            {isLoading
              ? loadingCards.map((_, index) => (
                  <div key={index} className="px-2 card-slide">
                    <Stack
                      spacing={4}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                    >
                      <Skeleton height="400px" width="250px" />
                      <SkeletonText noOfLines={2} spacing={4} />
                    </Stack>
                  </div>
                ))
              : cards.map((card: UserCollection, index: number) => (
                  <div key={card.cardID} className="px-2 card-slide">
                    <div className="card-wrapper">
                      <Image
                        src={`${pathToCards}${card.imageURL}`}
                        width={300}
                        height={475}
                        alt={`Card ${card.cardID}`}
                        className="rounded-sm shadow-lg"
                        loading="lazy"
                      />
                      <div className="card-info !bg-secondary">
                        <div className="text-secondary">
                          Opened by:{' '}
                          <Link
                            className="!text-link"
                            href={`/collect/${card.userID}`}
                            target="_blank"
                          >
                            <GetUsername userID={card.userID} />
                          </Link>
                        </div>
                        <Link
                          className="!text-link"
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
      </div>
    )
  }
)
