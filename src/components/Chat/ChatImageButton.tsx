import { Box, IconButton, Snackbar } from '@mui/material';
import { useRef, useState } from 'react';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

export default function ChatImageButton({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const handleClick = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setIsLoading(true);
      if (event.target.files?.length) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/image/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data.data) {
          onUpload(data.data);
        }
        setInputKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error('上傳圖片失敗', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <InsertPhotoIcon />
      </IconButton>
      <input
        key={inputKey}
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        disabled={isLoading}
        onChange={handleFileChange}
        accept="image/*"
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={isLoading}
        message="圖片上傳中..."
      />
    </Box>
  );
}
