import React from 'react';
import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import rarityMap from '@constants/rarity-map';
import rarityMapRubyPlus from `@constants/rarity-map-rubyPlus`;

const RarityInfoButton = ( { packID }: { packID: string }) => {
  const rarityPercentages = Object.entries(rarityMap)
    .map(([key, value]) => ({
      label: value.label,
      percentage: ((value.rarity / 10000) * 100).toFixed(2)
    }))
    .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

  return (
    <div className="inline-block">
      <Popover>
        <PopoverTrigger>
          <IconButton
            aria-label="Rarity information"
            icon={<Icon as={InfoIcon} />}
            size="sm"
            variant="ghost"
            colorScheme="blue"
          />
        </PopoverTrigger>
        <PopoverContent 
          bg="inherit"
          border="none"
          _focus={{ boxShadow: 'none' }}
        >
          <PopoverArrow bg="inherit" />
          <PopoverBody className="!p-0">
            <div className="flex flex-col gap-2 bg-primary text-secondary p-4 rounded-lg shadow-md">
              <div className="font-bold mb-2">
                Card Rarity Rates
              </div>
              {rarityPercentages.map(
                ({ label, percentage }) =>
                  percentage !== '0.00' && (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-sm">{label}</span>
                      <span className="text-sm">
                        {percentage}%
                      </span>
                    </div>
                  )
              )}
            </div>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RarityInfoButton;