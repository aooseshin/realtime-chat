import { Box, ButtonBase, IconButton, Popover, Theme } from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';
import React, { useState } from 'react';
import useAuth from '@/hooks/useAuth';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  },
  button: {
    border: '1px solid',
    borderColor: 'grey.200',
    fontSize: '10px',
    width: 20,
    height: 20,
    svg: {
      width: 10,
      height: 10,
    },
  },
  emojiButton: {
    border: '1px solid',
    borderRadius: '10px',
    px: 0.5,
    color: 'text.secondary',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
  },
  myEmoji: {
    borderColor: 'primary.main',
    color: 'primary.main',
  },
  reactionList: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    bgcolor: 'secondary.main',
    borderRadius: '10px',
    px: 0.5,
    button: {
      color: 'secondary.contrastText',
    },
  },
};

const emojis = [
  {
    name: 'like' as const,
    emoji: '🙂',
  },
  {
    name: 'love' as const,
    emoji: '😍',
  },
  {
    name: 'laugh' as const,
    emoji: '🤣',
  },
];

export default function ChatReaction({
  data,
  onEmojiClick,
}: {
  data: API.Message['reactionUsers'];
  onEmojiClick: (emoji: 'like' | 'love' | 'laugh') => void;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [{ user }] = useAuth();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiClick = (emoji: 'like' | 'love' | 'laugh') => {
    onEmojiClick(emoji);
    handleClose();
  };

  return (
    <Box sx={styles.root}>
      <IconButton sx={styles.button} size="small" onClick={handleClick}>
        <MoodIcon />
      </IconButton>
      {emojis.map((emoji) => {
        const count = data[emoji.name]?.length ?? 0;
        if (count === 0) return null;
        return (
          <ButtonBase
            key={emoji.name}
            sx={[
              styles.emojiButton,
              data[emoji.name].includes(user?.id ?? -1) && styles.myEmoji,
            ]}
            onClick={() => handleEmojiClick(emoji.name)}
          >
            {count} {emoji.emoji}
          </ButtonBase>
        );
      })}

      <Popover
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
        slotProps={{
          paper: {
            sx: styles.reactionList,
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {emojis.map((emoji) => (
          <IconButton
            key={emoji.name}
            size="small"
            onClick={() => handleEmojiClick(emoji.name)}
          >
            {emoji.emoji}
          </IconButton>
        ))}
      </Popover>
    </Box>
  );
}
