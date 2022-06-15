import type { NextPage } from 'next'
import { Box, Text } from '@mantine/core'
import { useState } from 'react';
import usePlayer from '../hooks/usePlayer';
import NameEntry from '../components/session/nameEntry';
import EndSessionButton from '../components/session/endSession';


const Home: NextPage = () => {
  // TODO: make a game request with the player ID
  const [nameSubmission, nameSubmissionSet] = useState<string | undefined>();
  // submit a new player to the server
  const { data: newPlayer, isLoading: newPlayerLoading, error: newPlayerError, } = usePlayer('new', nameSubmission);
  // subscribe to that player for state updates
  const {
    data: playerState,
    isLoading: playerStateLoading,
    error: playerStateError,
    remove,
  } = usePlayer('state', newPlayer?._id);

  console.log(playerState)

  function endSession(): void {
    remove();
    nameSubmissionSet(undefined);
  }

  return (
    <>
        {!playerState ? <NameEntry nameSubmissionSet={nameSubmissionSet} />: <EndSessionButton endSession={endSession}/>}
    </>
  )
}

export default Home
