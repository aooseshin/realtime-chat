import { Box, IconButton } from '@mui/material';
import { useRef, useState } from 'react';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { toast } from '../Toaster';

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
      toast.open({
        message: 'Uploading image...',
      });
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
      console.error('Upload image failed', error);
      toast.open({
        message: 'Upload image failed',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
      toast.close();
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
    </Box>
  );
}
