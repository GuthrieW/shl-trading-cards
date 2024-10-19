import { ChakraProvider, ChakraTheme, extendTheme } from '@chakra-ui/react'
import { colors } from '@utils/theme/colors'

export const chakraTheme: Partial<ChakraTheme> = {
  components: {
    button: {
      variants: {
        outline: {
          color: colors.text.primary,
          borderColor: colors.border.secondary,
          _hover: {
            bg: colors.background.secondary,
          },
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          maxHeight: '300px',
          overflowY: 'auto',
          minWidth: 'max-content',
          w: '100%',
          zIndex: 100,
          bg: colors.background.primary,
          borderColor: colors.border.primary,
        },
        item: {
          fontFamily: 'var(--font-montserrat)',
          color: colors.text.primary,
          bg: colors.background.primary,
        },
      },
    },
    Tabs: {
      variants: {
        line: {
          tablist: {
            borderColor: colors.border.secondary,
          },
          tab: {
            color: colors.text.tertiary,
            _selected: {
              borderColor: colors.background.primary,
              color: colors.text.primary,
            },
          },
        },
      },
    },
    Code: {
      baseStyle: {
        background: '',
        color: '',
      },
    },
    Table: {
      variants: {
        cardtable: {
          tr: {
            _even: {
              background: colors.background.primary,
            },
          },
        },
        homePage: {
          tr: {
            _even: {
              background: colors.background.primary,
            },
          },
        },
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: '',
        color: '',
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
        duration: 2500,
        isClosable: true,
        position: 'bottom-left',
      },
    }}
  >
    {children}
  </ChakraProvider>
)
