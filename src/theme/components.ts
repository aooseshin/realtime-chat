import { Components } from '@mui/material';

const components: Components = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
        width: '100%',
        fontFamily:
          '"Noto Sans TC", "Noto Sans", "Helvetica", "Arial", sans-serif',
      },
      '#__next': {
        height: '100%',
        width: '100%',
      },
      '*, *::before, *::after': {
        boxSizing: 'border-box',
      },
      img: {
        maxWidth: '100%',
        height: 'auto',
        verticalAlign: 'middle',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
};

export default components;
