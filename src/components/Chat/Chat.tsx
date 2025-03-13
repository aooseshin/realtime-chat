import { useConversation } from '@/queries/conversations';
import { formatTimestamp } from '@/utils/common';
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Skeleton,
  TextareaAutosize,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';

import Link from 'next/link';
import { useState } from 'react';
import { useMessages } from '@/queries/messages';
import ChatMessage from './ChatMessage';
import apis, { call } from '@/apis';
import useAuth from '@/hooks/useAuth';
import ChatImageButton from './ChatImageButton';
import Header from '../Header';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    bgcolor: 'background.default',
  },
  avatarGroup: {
    ml: 'auto',
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      fontSize: '12px',
    },
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  scroll: {
    overflow: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column-reverse',
    scrollbarWidth: 'thin',
    scrollbarColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? `${theme.palette.grey[300]} ${theme.palette.grey[50]}`
        : `${theme.palette.grey[700]} ${theme.palette.grey[900]}`,
  },
  action: {
    borderTop: '1px solid',
    p: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'grey.50' : 'background.paper',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
  },
  textarea: {
    flex: 1,
    '& textarea': {
      outline: 'none',
      px: 2.5,
      py: 1.25,
      width: '100%',
      borderRadius: '100px',
      border: '1px solid',
      typography: 'body1',
      bgcolor: 'background.default',
      color: 'text.primary',
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
    },
  },
};
export default function Chat({ id }: { id: number }) {
  const [{ user }] = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingReaction, setIsUpdatingReaction] = useState(false);

  const { data: conversationData } = useConversation(id);
  const { data: messagesData, mutate: mutateMessages } = useMessages(id, {
    refreshInterval: isUpdatingReaction ? 0 : 3000,
  });

  const title = conversationData?.data?.participants
    .map((p) => p.user)
    .join(', ');
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const disabled = !message || !user || !messagesData;

  const handleSendMessage = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    const [res] = await call(
      apis.messages.createMessage(id, {
        message,
        messageType: 'text',
        userId: user.id,
      })
    );
    if (res) {
      setMessage('');
      mutateMessages();
    }
    setIsLoading(false);
  };

  const handleUpload = async (url: string) => {
    if (!user) return;
    await call(
      apis.messages.createMessage(id, {
        message: url,
        messageType: 'image',
        userId: user.id,
      })
    );
    mutateMessages();
  };

  const handleEmojiClick = async (
    reactionType: 'like' | 'love' | 'laugh',
    messageId: number
  ) => {
    if (!user || !messagesData) return;
    setIsUpdatingReaction(true);
    mutateMessages(
      {
        data: messagesData.data.map((message) => {
          if (message.id === messageId) {
            const hasReaction = message.reactionUsers[reactionType].includes(
              user.id
            );
            return {
              ...message,
              reactionUsers: {
                ...message.reactionUsers,
                [reactionType]: hasReaction
                  ? message.reactionUsers[reactionType].filter(
                      (userId) => userId !== user.id
                    )
                  : [...message.reactionUsers[reactionType], user.id],
              },
            };
          }
          return message;
        }),
      },
      {
        revalidate: false,
      }
    );
    await call(
      apis.messages.toggleReaction({
        messageId,
        userId: user.id,
        reactionType,
      })
    );
    setIsUpdatingReaction(false);
  };

  return (
    <Box sx={styles.root}>
      <Header
        rightComponent={
          <AvatarGroup sx={styles.avatarGroup} max={2}>
            {conversationData?.data?.participants.map((p) => (
              <Avatar key={p.userId} src={p.avatar} alt={p.user} />
            ))}
          </AvatarGroup>
        }
      >
        <Box display="flex" alignItems="center" gap={1}>
          {mdDown && (
            <IconButton component={Link} href="/">
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {title ?? <Skeleton width={200} />}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {conversationData?.data?.timestamp ? (
                `Created at ${formatTimestamp(
                  Number(conversationData.data.timestamp)
                )}`
              ) : (
                <Skeleton width={60} />
              )}
            </Typography>
          </Box>
        </Box>
      </Header>

      <Box sx={styles.content}>
        <Box sx={styles.scroll}>
          {messagesData?.data?.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onEmojiClick={(emoji) => handleEmojiClick(emoji, message.id)}
            />
          ))}
        </Box>
      </Box>

      <Box sx={styles.action}>
        <Box sx={styles.textarea} flex={1}>
          <TextareaAutosize
            placeholder="Type a message..."
            value={message}
            disabled={isLoading}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
        </Box>
        <Box display="flex" gap={1}>
          <IconButton onClick={handleSendMessage} disabled={disabled}>
            <SubdirectoryArrowLeftIcon />
          </IconButton>
          <ChatImageButton onUpload={handleUpload} />
        </Box>
      </Box>
    </Box>
  );
}
