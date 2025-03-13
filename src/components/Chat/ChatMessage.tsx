import useAuth from '@/hooks/useAuth';
import { formatTimestamp } from '@/utils/common';
import { Avatar, Box, Theme, Typography } from '@mui/material';
import ChatReaction from './ChatReaction';
import Image from 'next/image';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    p: 2,
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    gap: 1,
    maxWidth: '80%',
  },
  wrapMe: {
    flexDirection: 'row-reverse',
    ml: 'auto',
  },
  message: {
    borderRadius: 2,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    color: 'text.primary',
    boxShadow: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? `0 0 5px 0 ${theme.palette.grey[300]}`
        : `0 0 5px 0 ${theme.palette.grey[900]}`,
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
  },
  messageMe: {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
  },
  system: {
    borderRadius: 2,
    maxWidth: '90%',
    mx: 'auto',
    my: 1,
    lineHeight: 1,
    color: 'text.secondary',
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'grey.50' : 'grey.800',
  },
  timestamp: {
    opacity: 0.5,
  },
};

export default function ChatMessage({
  message,
  onEmojiClick,
}: {
  message: API.Message;
  onEmojiClick: (emoji: 'like' | 'love' | 'laugh', messageId: number) => void;
}) {
  const [{ user }] = useAuth();
  const isMe = !!user && user.id === message.userId;

  if (message.messageType === 'system') {
    return (
      <Box sx={styles.system}>
        <Typography p={1} variant="caption">
          {message.message}
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={styles.root}>
      <Box sx={[styles.wrap, isMe && styles.wrapMe]}>
        {!isMe && <Avatar src={message.avatar} alt={message.user} />}
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Box sx={[styles.message, isMe && styles.messageMe]}>
            {message.messageType === 'text' && (
              <Typography px={1} pt={1} variant="body1">
                {message.message}
              </Typography>
            )}
            {message.messageType === 'image' && (
              <Image
                src={message.message}
                alt={message.user}
                width={100}
                height={0}
                style={{ width: '100%', height: 'auto', minWidth: 100 }}
              />
            )}
            <Typography sx={styles.timestamp} p={1} variant="caption">
              {!isMe && `${message.user}．`}
              {formatTimestamp(Number(message.timestamp))}
            </Typography>
          </Box>
          <ChatReaction
            data={message.reactionUsers}
            onEmojiClick={(emoji) => onEmojiClick(emoji, message.id)}
          />
        </Box>
      </Box>
    </Box>
  );
}
