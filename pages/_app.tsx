import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import Layout from '../components/layout/layout';
import { QueryClient, QueryClientProvider, } from 'react-query';
import {  AppContextProv, } from '../context/appContext';

export const queryClient = new QueryClient();


function MyApp({ Component, pageProps }: AppProps) {

  return (
    <AppContextProv>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </AppContextProv>
  )
}
export default MyApp;