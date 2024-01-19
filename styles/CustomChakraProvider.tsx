import { ChakraProvider, ChakraTheme, extendTheme } from '@chakra-ui/react'

const chakraTheme: Partial<ChakraTheme> = {
  components: {
    Menu: {
      baseStyle: {
        list: {
          maxHeight: '300px',
          overflowY: 'auto',
          minWidth: 'max-content',
          w: '100%',
          zIndex: 100,
        },
        item: {
          fontFamily: 'var(--font-montserrat)',
        },
      },
    },
    Tabs: {
      variants: {
        line: {
          tab: {
            _selected: {
              borderColor: '#ADB5BD',
              color: 'black',
            },
          },
        },
      },
    },
  },
  styles: {
    global: () => ({
      body: {
        bg: 'rgb(233 236 239)',
      },
    }),
  },
}

const theme = extendTheme(chakraTheme)

export const CustomChakraProvider = ({
  children,
}: {
  children: React.ReactElement
}) => (
  <ChakraProvider
    resetCSS={false}
    theme={theme}
    toastOptions={{
      defaultOptions: {
        duration: 9000,
        isClosable: true,
        position: 'bottom-right',
      },
    }}
  >
    {children}
  </ChakraProvider>
)
