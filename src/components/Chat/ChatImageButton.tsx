import { Box, IconButton } from '@mui/material';
import { useRef, useState } from 'react';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

export default function ChatImageButton({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
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
        onChange={handleFileChange}
      />
    </Box>
  );
}
