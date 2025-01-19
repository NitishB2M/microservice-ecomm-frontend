import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif', // Set Poppins as the default font
  },
  colorSchemes: {
    light: true,
    dark: true,
  },
});

export default theme;