import { ThemeProvider } from '@mui/material';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import lightTheme from '@/theme/light';
import darkTheme from '@/theme/dark';
export interface LayoutValue {
  theme: 'light' | 'dark';
}

const initialValue = {
  theme: 'light' as const,
};

type LayoutContextValue = [LayoutValue, Dispatch<SetStateAction<LayoutValue>>];

type LayoutProviderProps = {
  children: ReactNode;
};

export const LayoutContext = createContext<LayoutContextValue>([
  initialValue,
  () => {},
]);

export function LayoutProvider({ children }: LayoutProviderProps) {
  const providerValue = useState<LayoutValue>(initialValue);

  return (
    <LayoutContext.Provider value={providerValue}>
      <ThemeProvider
        theme={providerValue[0].theme === 'light' ? lightTheme : darkTheme}
      >
        {children}
      </ThemeProvider>
    </LayoutContext.Provider>
  );
}
