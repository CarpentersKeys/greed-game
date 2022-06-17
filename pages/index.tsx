import type { NextPage } from 'next'
import { useState } from 'react';
import usePlayerState from '../hooks/usePlayerState';
import useNewPlayer from '../hooks/useNewPlayer';
import NameEntry from '../components/session/nameEntry';
import EndSessionButton from '../components/session/endSession';
import GetGame from '../components/session/getGame';

const Home: NextPage = () => {
  // TODO: make a game request with the player ID
  const [nameSubmission, nameSubmissionSet] = useState<string | undefined | null>();
  // submit a new player to the server
  const { data: newPlayer, } = useNewPlayer(nameSubmission);
  // subscribe to that player for state updates
  const { data: playerState, } = usePlayerState(newPlayer?._id);

  console.log('playerState', playerState)

  // TODO effectively disable usePlayers after endSession
  function endSession(): void {
    nameSubmissionSet(null);
    console.log('NAMEsdUB:', nameSubmission, 'newPlayer:', newPlayer, 'playerState:', playerState)
    // enable name submission
  }

  return (
    <>
      {!playerState ? <NameEntry nameSubmissionSet={nameSubmissionSet} /> : <EndSessionButton endSession={endSession} />}
      {playerState && !playerState?.inGame && <GetGame playerId={playerState._id}/>}
    </>
  )
}

export default Home
