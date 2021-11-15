import { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';

import '../styles/main.css';
import theme from '../utils/theme';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <Component {...pageProps} />
  </ThemeProvider>
);

export default MyApp;
