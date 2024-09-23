import { useQuery } from 'react-query';
import axios from 'axios';
import { pathToCards } from '@constants/path-to-cards';
import Image from 'next/image';
import { SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import { LatestCards } from '@pages/api/v3';
import { GET } from '@constants/http-methods';
import { query } from '@pages/api/database/query';

interface PackOpenProps {
  packID: string;
}

const PackOpen: React.FC<PackOpenProps> = ({ packID }) => {
  const customLoader = (src: string) => {
    return `https://simulationhockey.com/tradingcards/${src}.png`;
  };

  const { payload: cards, isLoading: isLoading } = query<LatestCards[]>({
    queryKey: ['latest-cards', packID],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/uid/latest-cards?packID=${packID}`,
      }),
    enabled: !!packID,
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Spinner />
      </div>
    );
  }
  return (
    <SimpleGrid columns={5} spacing={4}>
      {cards.map((card: LatestCards) => (
        <Image
          loader={() => customLoader(card.cardID)}
          key={card.cardID}
          src={`${pathToCards}${card.cardID}.png`}
          width={50}
          height={75}
          alt={`Card ${card.cardID}`}
          className="w-full h-full cursor-pointer rounded-sm"
          loading="lazy"
          unoptimized={true}
        />
      ))}
    </SimpleGrid>
  );
};

export default PackOpen;
