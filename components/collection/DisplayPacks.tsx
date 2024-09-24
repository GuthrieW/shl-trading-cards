import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Image,
    Box,
    Text,
    SimpleGrid,
    Spinner,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import axios from 'axios';
  import { query } from '@pages/api/database/query';
  import { GET } from '@constants/http-methods';
  import PackOpen from '@components/collection/PackOpen';
  import { UserLatestPack } from '@pages/api/v3';
  
  interface DisplayPacksProps {
    userID: string;
  }
  
  const DisplayPacks: React.FC<DisplayPacksProps> = ({ userID }) => {
    const [selectedPackID, setSelectedPackID] = useState<string | null>(null);
  
    const { payload: packs, isLoading: packsLoading } = query<UserLatestPack[]>({
      queryKey: ['latest-cards', userID],
      queryFn: () =>
        axios({
          method: GET,
          url: `/api/v3/collection/uid/latest-packs?userID=${userID}`,
        }),
      enabled: !!userID,
    });
  
    const handlePackClick = (packID: string) => {
      setSelectedPackID(packID === selectedPackID ? null : packID);
    };
  
    return (
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Latest Packs Opened
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {packsLoading ? (
              <Spinner />
            ) : packs && packs.length > 0 ? (
              <SimpleGrid columns={3} spacing={4}>
                {packs.map((pack, index) => (
                  <Box key={pack.packID} textAlign="center">
                    <Image
                      src="/base-pack-cover.png"
                      alt={`Pack Cover ${index + 1}`}
                      onClick={() => handlePackClick(pack.packID)}
                      className="cursor-pointer"
                      width={100}
                      height={175}
                      style={{ border: selectedPackID === pack.packID ? '2px solid yellow' : 'none' }}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <div>No packs available.</div>
            )}
            {selectedPackID && (
              <Box mt={4}>
                <PackOpen packID={selectedPackID} />
              </Box>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  };
  
  export default DisplayPacks;
  