import { Alert, Snackbar } from '@mui/material';

import { toast } from './toast';
import { useToaster } from './store';

export default function Toaster() {
  const { settings, open } = useToaster();
  const handleClose = () => {
    toast.close();
    settings.onClose?.();
  };

  const props = {
    anchorOrigin: { vertical: 'bottom' as const, horizontal: 'right' as const },
    open,
    message: settings.message,
    onClose: handleClose,
    autoHideDuration: settings.autoHideDuration,
  };

  if (!settings.variant) {
    return <Snackbar {...props} />;
  }

  return (
    <Snackbar {...props}>
      <Alert severity={settings.variant} variant="filled" onClose={handleClose}>
        {settings.message}
      </Alert>
    </Snackbar>
  );
}
