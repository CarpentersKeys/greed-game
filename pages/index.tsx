import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import useGameState from '../components/shared/hooks/game/useGameState';
import usePlayerState from '../components/shared/hooks/player/usePlayerState';
import NewSession from '../components/session/newSession';

const Home: NextPage = () => {
  /**
   * responsible for:
   *  render name entry 
   *  redirect to /game when playerId and gameId are set
   */
  const router = useRouter();
  const { playerId, playerState } = usePlayerState();
  useGameState({ onGameId: () => router.push('/game') });
// console.log(playerState)
  return (
    <>
      <NewSession />
    </>
  )
}

export default Home
