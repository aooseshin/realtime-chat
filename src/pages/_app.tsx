import type { AppProps } from 'next/app';
import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter';
import { CssBaseline, NoSsr } from '@mui/material';
import { AuthProvider } from '@/context/AuthContext';
import { LayoutProvider } from '@/context/LayoutContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppCacheProvider {...pageProps}>
      <LayoutProvider>
        <CssBaseline />
        <AuthProvider>
          <NoSsr>
            <Component {...pageProps} />
          </NoSsr>
        </AuthProvider>
      </LayoutProvider>
    </AppCacheProvider>
  );
}
