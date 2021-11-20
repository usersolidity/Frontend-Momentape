import { AppProps } from "next/app";
import { ThemeProvider } from "@emotion/react";

import "../styles/main.css";
import theme from "../utils/theme";
import { AuthProvider } from "../utils/AuthContext";

const MyApp = ({ Component, pageProps }: AppProps) => (
    <AuthProvider>
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    </AuthProvider>
);

export default MyApp;
