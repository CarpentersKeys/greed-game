import { useForm } from '@mantine/form';
import type { NextPage } from 'next'
import { Button, Group, Box, Text, TextInput } from '@mantine/core'
import { useState } from 'react';
import usePlayer from '../hooks/usePlayer';

const Home: NextPage = () => {
  // TODO: handle the no value states
  // TODO: make a game request with the player ID
  const [nameSubmission, nameSubmissionSet] = useState<string | undefined>();
  const { data: newPlayer, isLoading: newPlayerLoading, error: newPlayerError, } = usePlayer('new', nameSubmission);
  const { data: playerState, isLoading: playerStateLoading, error: playerStateError, } = usePlayer('state', newPlayer?._id);

  console.log('index plyerState', playerState);

  const form = useForm({
    initialValues: {
      name: '',
    },

    validate: {
      name: (val) => (val.length > 3 ? null : 'User a longer name'),
    },
  });

  // destructuring types https://flaviocopes.com/typescript-object-destructuring/
  function handleSubmitPlayer({ name }: { name: string }): void {
    nameSubmissionSet(name);
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
          <form onSubmit={form.onSubmit(handleSubmitPlayer)}>
            <TextInput
              required
              label='Name'
              placeholder='your name for this match'
              {...form.getInputProps('name')} // interesting pattern, returns value, onChange and error
            >
            </TextInput>
            {/* <Checkbox
              mt="md"
              label='Automatch'
              {...form.getInputProps('autoMatch', { type: 'checkbox' })}
              required
            /> */}
            <Group position="right" mt="md">
              <Button type="submit">Find Match</Button>
            </Group>
          </form>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
