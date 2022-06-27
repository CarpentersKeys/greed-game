import type { NextPage } from 'next'
import usePlayerState from '../hooks/player/usePlayerState';
import NameEntry from '../components/session/nameEntry';
import useGameState from '../hooks/game/useGameState';
import Game from '../components/game';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/playerContext';

const Home: NextPage = () => {
  const { appState: { playerId, gameId } } = useContext(AppContext);

  // subscribe to state updates
  const usePlayerStateResult = usePlayerState(playerId);
  const useGameStateResult = useGameState(gameId);
  const playerState = usePlayerStateResult.data;
  const gameState = useGameStateResult.data;

  return (
    <>
      {
        !playerState && <NameEntry />
      }
      {
        playerState
        && !gameState?.isOpen
        && <Game />
      }
    </>
  )
}
Home.displayName = 'Home'

export default Home
