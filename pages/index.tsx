import type { NextPage } from 'next'
import usePlayerState from '../hooks/usePlayerState';
import NameEntry from '../components/session/nameEntry';
import EndSessionButton from '../components/session/endSession';
import GetGame from '../components/session/getGame';
import useNewPlayer from '../hooks/useNewPlayer';

const Home: NextPage = () => {
  // TODO: make a game request with the player ID
  // submit a new player to the server
  const { sessionReset, sessionPlayerId, submitNewPlayer } = useNewPlayer();
  // subscribe to that player for state updates
  const { playerState } = usePlayerState(sessionPlayerId);

  // console.log('playerState', playerState)

  // TODO effectively disable usePlayers after endSession
  function endSession(): void {
    sessionReset();
  }

  return (
    <>
      {!playerState ? <NameEntry newPlayerFromName={submitNewPlayer} /> : <EndSessionButton endSession={endSession} />}
      {playerState && !playerState?.inGame && <GetGame playerId={playerState._id} />}
    </>
  )
}

export default Home
