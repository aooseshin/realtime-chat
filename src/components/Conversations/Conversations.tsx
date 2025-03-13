import {
  Avatar,
  AvatarGroup,
  Box,
  ButtonBase,
  Chip,
  Skeleton,
  Theme,
  Typography,
} from '@mui/material';
import { useConversations } from '@/queries/conversations';
import useAuth from '@/hooks/useAuth';
import { formatTimestamp } from '@/utils/common';
import Link from 'next/link';

const styles = {
  root: {
    height: '100%',
    overflow: 'auto',
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'grey.100' : 'background.paper',
    borderRight: '1px solid',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    p: 2,
    pt: 0,
  },
  card: {
    borderRadius: 2,
    p: 1,
    px: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    width: '100%',
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'background.default' : 'grey.900',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    p: 2,
    color: 'text.primary',
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'grey.100' : 'background.paper',
  },
  active: {
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
  },
  avatarGroup: {
    '& .MuiAvatar-root': {
      width: 24,
      height: 24,
      fontSize: '12px',
    },
  },
  title: {
    display: 'flex',
    mb: 1,
    gap: 1,
    width: '100%',
    alignItems: 'center',
    h6: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
};
const EmptyCard = () => {
  return (
    <Box sx={styles.card}>
      <Typography variant="h6" color="primary.main" fontWeight={700}>
        <Skeleton width={100} />
      </Typography>
      <Typography width="100%" variant="body2">
        <Skeleton width="100%" />
      </Typography>
      <Typography variant="caption">
        <Skeleton width={100} />
      </Typography>
    </Box>
  );
};
export default function Conversations({ id }: { id?: number }) {
  const [{ user }] = useAuth();
  const { data } = useConversations();

  if (!data)
    return (
      <Box sx={styles.root}>
        <Box sx={styles.header}>
          <Typography variant="h4" fontWeight={700}>
            對話
          </Typography>
        </Box>
        <Box sx={styles.cards}>
          <EmptyCard />
          <EmptyCard />
          <EmptyCard />
        </Box>
      </Box>
    );

  return (
    <Box sx={styles.root}>
      <Box sx={styles.header}>
        <Typography variant="h5" fontWeight={700}>
          對話
        </Typography>
      </Box>
      <Box sx={styles.cards}>
        {data?.data.map((conversation) => {
          const title = conversation.participants
            .map((participant) => participant.user)
            .join(', ');
          return (
            <ButtonBase
              sx={[styles.card, id === conversation.id && styles.active]}
              key={conversation.id}
              component={Link}
              href={`/conversation/${conversation.id}`}
            >
              <Box sx={styles.title}>
                <Box flex={1} minWidth={0}>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight={700}
                  >
                    {title}
                  </Typography>
                </Box>
                <Box ml="auto">
                  {!conversation.participants.some(
                    (participant) => participant.userId === user?.id
                  ) && <Chip label="你尚未加入此對話" size="small" />}
                </Box>
              </Box>
              <Typography variant="body2" color="text.primary">
                {conversation.lastMessage}
              </Typography>
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(Number(conversation.lastMessageTimestamp))}
                </Typography>
                <AvatarGroup sx={styles.avatarGroup} max={4}>
                  {conversation.participants.map((participant) => (
                    <Avatar
                      key={participant.userId}
                      alt={participant.user}
                      src={participant.avatar}
                    />
                  ))}
                </AvatarGroup>
              </Box>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
