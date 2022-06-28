import type { NextPage } from 'next'
import NameEntry from '../components/session/nameEntry';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/appContext';
import { useRouter } from 'next/router';
import usePlayerState from '../hooks/player/usePlayerState';
import useGameState from '../hooks/game/useGameState';

const Home: NextPage = () => {
  const { appState: { playerId, gameId } } = useContext(AppContext);
  const { data: playerState } = usePlayerState(playerId);
  const { data: gameState } = useGameState(gameId);
  const router = useRouter();
  console.log('Home stes', playerState, gameState);
  useEffect(() => {
    if (playerState?._id && gameState?._id) {
      router.push('/game')
    }
  }, [playerState, gameState])

  return (
    <>
      {
        (!playerState?._id || !gameState?._id)
        && <NameEntry />
      }
    </>
  )
}
Home.displayName = 'Home'

export default Home
