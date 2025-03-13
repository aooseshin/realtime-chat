import { Box, IconButton, Theme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import { useContext } from 'react';
import { LayoutContext } from '@/context/LayoutContext';

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    p: 2,
    borderBottom: '1px solid',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    gap: 1,
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'grey.50' : 'background.paper',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
};
export default function Header({
  children,
  rightComponent,
}: {
  children?: React.ReactNode;
  rightComponent?: React.ReactNode;
}) {
  const [{ theme }, setValue] = useContext(LayoutContext);
  return (
    <Box sx={styles.header}>
      <Box flex={1}>{children}</Box>
      <Box
        sx={styles.right}
        onClick={() =>
          setValue({ theme: theme === 'light' ? 'dark' : 'light' })
        }
      >
        {rightComponent}
        <IconButton>
          {theme === 'light' ? <LightModeIcon /> : <BedtimeIcon />}
        </IconButton>
      </Box>
    </Box>
  );
}
