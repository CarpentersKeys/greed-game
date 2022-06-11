import { useForm } from '@mantine/form';
import type { NextPage } from 'next'
import { Button, Group, Box, Text, TextInput, Checkbox } from '@mantine/core'

const Home: NextPage = () => {
  const form = useForm({
    initialValues: {
      name: '',
      autoMatch: true,
    },

    validate: {
      name: (val) => (val.length > 3 ? null : 'Invalid email'),
    },
  });

  async function handleSubmit(values: typeof form.values): Promise<string> {
    const { name, autoMatch } = values;

    const newPlayer: Player = { name, autoMatch };
    const url: string = ('/api/queu');
    const options: RequestInit = { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(newPlayer) }
    // api call
    const urlResp: Response = await fetch(url, options);
    const json: object = urlResp.ok && await urlResp.json();
    console.log(json)

    // submit name to db
    if (autoMatch) {
      // populate list of queued users
    } else {
      // just grab the first user and start a game
    }
    return ''
  }

  return (
    <Box
      component="main"
      sx={{
        paddingLeft: '2rem',
        paddingRight: '2rem',
      }}
    >
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          paddingTop: '2rem',
          paddingBottom: '2rem',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
        <Box>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              required
              label='Name'
              placeholder='your temporary name'
              {...form.getInputProps('name')}
            >
            </TextInput>
            <Checkbox
              mt="md"
              label='Automatch'
              {...form.getInputProps('autoMatch', { type: 'checkbox' })}
              required
            />
            <Group position="right" mt="md">
              <Button type="submit">Find Match</Button>
            </Group>
          </form>
        </Box>
      </Box>
    </Box>
  )
}

interface Player {
  name: string,
  autoMatch: boolean,
}

export default Home
