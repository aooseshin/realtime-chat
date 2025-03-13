import { Box, Theme, useMediaQuery } from '@mui/material';
import Conversations from '@/components/Conversations';
import UserLogin from '@/components/UserLogin';
import Chat from '@/components/Chat';
import { useRouter } from 'next/router';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: { md: '400px 1fr' },
  },
  empty: {
    display: { xs: 'none', md: 'flex' },
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
};
export default function Conversation() {
  const { id } = useRouter().query;
  const conversationId = Number(id);
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  return (
    <Box sx={styles.root}>
      {mdUp && <Conversations id={conversationId} />}
      <Chat id={conversationId} />
      <UserLogin />
    </Box>
  );
}
