import React from 'react'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import PlayerCardComponent from './PlayerCardComponent'
import { LineupPosition, POSITION_CONSTANTS } from './types'

interface PositionBlockProps {
  position: LineupPosition
}

const PositionBlock: React.FC<PositionBlockProps> = ({ position }) => (
  <Droppable droppableId={position.id}>
    {(provided, snapshot) => (
      <Box
        ref={provided.innerRef}
        {...provided.droppableProps}
        bg={useColorModeValue(
          snapshot.isDraggingOver ? 'gray.100' : 'white',
          snapshot.isDraggingOver ? 'gray.700' : 'gray.800'
        )}
        border="2px"
        borderColor={
          position.card
            ? 'green.500'
            : snapshot.isDraggingOver
              ? useColorModeValue('blue.400', 'blue.400')
              : useColorModeValue('gray.300', 'gray.600')
        }
        borderStyle={position.card ? 'solid' : 'dashed'}
        borderRadius="md"
        p={4}
        minH={POSITION_CONSTANTS.MIN_HEIGHT}
        minW={POSITION_CONSTANTS.MIN_WIDTH}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        transition="border-color 0.2s, background-color 0.2s"
      >
        <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('gray.800', 'white')} mb={2}>
          {position.name}
        </Text>

        {position.card ? (
          <Draggable draggableId={position.card.cardID.toString()} index={0}>
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <PlayerCardComponent card={position.card} isDragging={snapshot.isDragging} />
              </Box>
            )}
          </Draggable>
        ) : (
          <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} textAlign="center">
            Drag a card here
          </Text>
        )}

        {provided.placeholder}
      </Box>
    )}
  </Droppable>
)

export default PositionBlock
