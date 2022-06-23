import type { NextPage } from 'next'
import usePlayerState from '../hooks/usePlayerState';
import NameEntry from '../components/session/nameEntry';
import EndSessionButton from '../components/session/endSession';
import useMutatePlayer from '../hooks/useMutatePlayer';
import useMutateGame from '../hooks/useMutateGame';
import useGameState from '../hooks/useGameState';
import Game from '../components/game';

const Home: NextPage = () => {
  // TODO: make a game request with the player ID
  // submit a new player to the server
  const { newPlayerId, submitNewPlayer, updatePlayerState, assignRoles, deletePlayer, } = useMutatePlayer();
  // subscribe to that player for state updates
  const usePlayerStateResult = usePlayerState(newPlayerId);
  const { newGameId, updateGameState, removePlayerFromGame } = useMutateGame(newPlayerId, assignRoles);
  const useGameStateResult = useGameState(newGameId);
  const playerState = usePlayerStateResult.data;
  const gameState = useGameStateResult.data;
  // console.log('playerState:', playerState);
  // console.log('gameState:', gameState);

  function endSession(): void {
    if (playerState) {
      removePlayerFromGame(playerState._id);
      deletePlayer(playerState._id);
    };
  };

  return (
    <>
      {
        !playerState
          ? <NameEntry submitNewPlayer={submitNewPlayer} />
          : <EndSessionButton endSession={endSession} />
      }
      {
        playerState
        && !gameState?.isOpen
        && <Game
          useGameStateResult={useGameStateResult}
          updateGameState={updateGameState}
          usePlayerStateResult={usePlayerStateResult}
          updatePlayerState={updatePlayerState}
          assignRoles={assignRoles}
        />
      }
    </>
  )
}

export default Home
