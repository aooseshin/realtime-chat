import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

export interface AuthValue {
  user: API.User | null;
}

const initialValue = {
  user: null,
};

type AuthContextValue = [AuthValue, Dispatch<SetStateAction<AuthValue>>];

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextValue>([
  initialValue,
  () => {},
]);

export function AuthProvider({ children }: AuthProviderProps) {
  const providerValue = useState<AuthValue>(initialValue);

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const MainLayoutConsumer = AuthContext.Consumer;
