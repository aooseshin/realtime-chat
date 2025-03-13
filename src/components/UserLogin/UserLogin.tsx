import apis, { call } from '@/apis';
import useAuth from '@/hooks/useAuth';
import { useUsers } from '@/queries/users';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Dialog,
  Divider,
  InputBase,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const styles = {
  paper: {
    bgcolor: 'primary.main',
    color: 'background.default',
    p: 4,
    display: 'grid',
    gap: 4,
    alignItems: 'center',
    borderRadius: 4,
    textAlign: 'center',
  },
  users: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: 1,
  },
  user: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
    py: 1,
    borderRadius: 2,
  },
  divider: {
    width: '100%',
    '&::before, &::after': {
      borderColor: 'background.default',
    },
  },
  input: {
    flex: 1,
    '& input': {
      bgcolor: 'background.default',
      borderRadius: 2,
      p: 2,
    },
  },
  field: {
    width: '100%',
    display: 'flex',
    gap: 1,
  },
};

export default function UserLogin() {
  const [{ user }, setAuth] = useAuth();
  const { data } = useUsers();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    setLoading(true);
    const [res] = await call(apis.users.createAccount(name));
    if (res) {
      setAuth({ user: res.data });
    }
    setLoading(false);
  };

  if (user) return null;

  return (
    <Dialog
      slotProps={{
        paper: {
          sx: styles.paper,
        },
      }}
      fullWidth
      maxWidth="xs"
      open
    >
      <Typography variant="h6">Please select a user to login</Typography>
      <Box sx={styles.users}>
        {data?.data.map((user) => (
          <ButtonBase
            key={user.id}
            sx={styles.user}
            onClick={() => setAuth({ user })}
          >
            <Avatar src={user.avatar} />
            <Typography variant="body2">{user.name}</Typography>
          </ButtonBase>
        ))}
      </Box>
      <Divider sx={styles.divider}>or create a new user</Divider>
      <Box sx={styles.field}>
        <InputBase
          sx={styles.input}
          placeholder="User name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreateAccount();
            }
          }}
        />
        <Button
          variant="contained"
          color="warning"
          disabled={loading || !name}
          onClick={handleCreateAccount}
        >
          Create
        </Button>
      </Box>
    </Dialog>
  );
}
