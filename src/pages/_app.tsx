import { ThemeProvider } from '@emotion/react';
import { AppProps } from 'next/app';
import theme from '../utils/theme';
import '../styles/main.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <Component {...pageProps} />
  </ThemeProvider>
);

export default MyApp;
