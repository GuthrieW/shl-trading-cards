import React from 'react';
import { Box, Text, Button, VStack, HStack, Skeleton } from '@chakra-ui/react';
import { UserMostCards } from '@pages/api/v3';
import { useRouter } from 'next/router';

interface MostCardsTableProps {
  data: UserMostCards[];
  isLoading: boolean;
}

const MostCardsTable: React.FC<MostCardsTableProps> = ({ data, isLoading }) => {
  const router = useRouter();

  const handleRowClick = (userID: number) => {
    router.push(`/collect/${userID}`);
  };

  return (
    <Box className="bg-primary text-secondary border border-gray-200 rounded-lg p-4 shadow-md">
      <div className="font-bold mb-4 lg:text-xl sm:text-lg">User Collections</div>
      <VStack spacing={2} align="stretch">
        {isLoading
          ? Array(5).fill(null).map((_, index) => (
              <Skeleton key={index} height="20px" />
            ))
          : data.slice(0, 10).map((user, index) => (
              <HStack 
                key={user.userID} 
                justify="space-between" 
                className="py-1 cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-primary"
                onClick={() => handleRowClick(user.userID)}
              >
                <div className="font-medium lg:text-xl text-sm sm:text-xs">
                  {index + 1}. {user.username} 
                </div>
                <div className="font-medium text-sm lg:text-xl sm:text-xs">
                  Unique: {user.uniqueCards} Total: {user.totalCards}
                </div>
              </HStack>
            ))
        }
      </VStack>
      <Button 
        mt={4} 
        className="w-full bg-blue-500 !hover:bg-blue-600 hover:shadow-xl text-secondary font-bold py-2 px-4 rounded text-sm sm:text-xs"
        onClick={() => router.push('/community')}
      >
        See All Collections
      </Button>
    </Box>
  );
};

export default MostCardsTable;