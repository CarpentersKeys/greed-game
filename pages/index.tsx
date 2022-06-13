import { useForm } from '@mantine/form';
import type { NextPage } from 'next'
import { Button, Group, Box, Text, TextInput } from '@mantine/core'
import usePlayerState from '../hooks/usePlayerState';
import { IPlayer, isPlayer } from '../models/player/types';
import { useState } from 'react';
import { HydratedDocument, ObjectId } from 'mongoose';

const Home: NextPage = () => {
  const [playerId, playerIdSet] = useState<ObjectId | null>(null);
  const { isLoading, error, playerState } = usePlayerState(playerId);

  const form = useForm({
    initialValues: {
      name: '',
    },

    validate: {
      name: (val) => (val.length > 3 ? null : 'User a longer name'),
    },
  });

  async function handleSubmitPlayer(values: typeof form.values): Promise<string> {
    const { name } = values;

    // submit a new player to DB
    const newPlayer: IPlayer = { name };
    const url: string = ('/api/player');
    const options: RequestInit = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newPlayer),
    }
    const urlResp: Response =
      await fetch(url, options);
    // get a player back
    const playerResp: HydratedDocument<IPlayer> = urlResp.ok &&
      await urlResp.json();

    if (isPlayer(playerResp)) {
      // make sure it's a player before passing ID to our playerState fetcher
      playerIdSet(playerResp._id as ObjectId);

      // TODO: make a game request with the player ID
      // const newGame = new Game({ players: [{ name: 'tim', }, { name: 'eric', }], })
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
          <form onSubmit={form.onSubmit(handleSubmitPlayer)}>
            <TextInput
              required
              label='Name'
              placeholder='your temporary name'
              {...form.getInputProps('name')}
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
