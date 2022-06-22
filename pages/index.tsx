import type { NextPage } from 'next'
import usePlayerState from '../hooks/usePlayerState';
import NameEntry from '../components/session/nameEntry';
import EndSessionButton from '../components/session/endSession';
import useMutatePlayer from '../hooks/useMutatePlayer';
import useMutateGame from '../hooks/useMutateGame';
import useGameState from '../hooks/useGameState';
import { Button } from '@mantine/core';
import stateFetch from '../fetchers/stateFetch';
import { useQuery } from 'react-query';

const Home: NextPage = () => {
  // TODO: make a game request with the player ID
  // submit a new player to the server
  const { newPlayerId, submitNewPlayer, deletePlayer, } = useMutatePlayer();
  // subscribe to that player for state updates
  const { playerState, } = usePlayerState(newPlayerId);
  const { newGameId, removePlayerFromGame } = useMutateGame(newPlayerId);
  const { gameState, } = useGameState(newGameId);
  // console.log('playerState:', playerState);
  // console.log('gameState:', gameState);

  function endSession(): void {
    //TODO when ending session kill all open games
    //TODO decide how to handle this id arguement
    // console.log(playerState._id)
    if (playerState) {
      removePlayerFromGame(playerState._id);
      deletePlayer(playerState._id);
    };

  };
  function getAllGames() {

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
