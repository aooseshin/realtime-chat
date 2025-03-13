import { Box } from '@mui/material';
import Conversations from '@/components/Conversations';
import UserLogin from '@/components/UserLogin';
import Header from '@/components/Header';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    bgcolor: 'background.default',
    color: 'text.primary',
    gridTemplateColumns: { md: '400px 1fr' },
  },
  main: {
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'column',
    flex: 1,
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
};
export default function Home() {
  return (
    <Box sx={styles.root}>
      <Conversations />
      <Box sx={styles.main}>
        <Header />
        <Box sx={styles.empty}>
          Please select a conversation to start chatting!
        </Box>
      </Box>
      <UserLogin />
    </Box>
  );
}
