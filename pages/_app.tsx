import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import Layout from '../components/layout/layout';
import { QueryClient, QueryClientProvider, } from 'react-query';
import { AppContext, IAppState, } from '../context/playerContext';
import { useEffect, useState } from 'react';

export const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  // TODO: implement a better setter
  const [appState, appStateSet] = useState<IAppState>({
    playerId: null,
    gameId: null,
    cleanupFns: [],
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ appState, appStateSet }}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'light',
            breakpoints: {
              xs: 500,
              sm: 800,
              md: 1000,
              lg: 1200,
              xl: 1400,
            },
          }}
        >
          <Layout >
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </AppContext.Provider>

      {/* }     */}
    </QueryClientProvider>
  )
}
export default MyApp;