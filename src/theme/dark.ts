import { createTheme } from '@mui/material';
import components from './components';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components,
});

export default theme;
