import type { NextPage } from 'next'
import usePlayerState from '../hooks/usePlayerState';
import NameEntry from '../components/session/nameEntry';
import EndSessionButton from '../components/session/endSession';
import useMutatePlayer from '../hooks/useMutatePlayer';
import useMutateGame from '../hooks/useMutateGame';
import useGameState from '../hooks/useGameState';

const Home: NextPage = () => {
  // TODO: make a game request with the player ID
  // submit a new player to the server
  const { newPlayerId, submitNewPlayer, playerReset, } = useMutatePlayer();
  // subscribe to that player for state updates
  const { playerState, } = usePlayerState(newPlayerId);
  const { newGameId, } = useMutateGame(newPlayerId);
  const { gameState, } = useGameState(newGameId);

  // console.log('playerState:', playerState);
  // console.log('gameState:', gameState);

  function endSession(): void {
    //TODO when ending session kill all open games
    playerReset();
  }

  return (
    <>
      {!playerState
        ? <NameEntry submitNewPlayer={submitNewPlayer} />
        : <EndSessionButton endSession={endSession} />}
    </>
  )
}

export default Home
