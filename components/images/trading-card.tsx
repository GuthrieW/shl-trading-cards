import React from 'react';
import { Box, Image, useBreakpointValue } from '@chakra-ui/react';

export type TradingCardProps = {
  source: string;
  playerName: string;
  rarity: string;
  className?: string;
};

const TradingCard = ({
  source,
  playerName,
  rarity,
  className,
}: TradingCardProps) => {
  const aspectRatio = useBreakpointValue({ base: 4/5, md: 3/4 });
  const maxHeight = useBreakpointValue({ base: "70vh", md: "80vh" });

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    >
      <Box
        width="auto"
        height={`min(${maxHeight}, 100%)`}
        position="relative"
        aspectRatio={aspectRatio}
      >
        <Image
          src={`https://simulationhockey.com/tradingcards/${source}`}
          alt={`${rarity} ${playerName}`}
          loading="lazy"
          fallbackSrc="/cardback.png"
          objectFit="contain"
          width="100%"
          height="100%"
          className={`rounded-sm ${className}`}
        />
      </Box>
    </Box>
  );
};

export default TradingCard;