import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#833CDE',
    },
    secondary: {
      main: '#fff',
    },
  },
  components: {
    MuiIcon: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
  },
});

export default theme;
