import { Text } from "@mantine/core"

export default function Header() {
    return (
                <Text
          sx={{
            color: '#0070f3',
            fontSize: '2rem',
            '@media (min-width: 800px)': {
              fontSize: '3rem',
            },
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          This is a game of greed!
        </Text>
    )
}