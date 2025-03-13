import { createTheme } from '@mui/material';
import components from './components';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  components,
});

export default theme;
