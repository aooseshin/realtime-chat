import { ReactNode } from 'react';

export type ToasterProps = {
  message: ReactNode;
  title?: string;
  autoHideDuration?: number;
  variant?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
};
