import { createTheme } from '@mui/material';
import components from './components';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: '"Noto Sans TC", "Noto Sans", "Helvetica", "Arial", sans-serif',
  },
  components,
});

export default theme;
