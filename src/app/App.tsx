import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import jangadaLogo from '../imports/jangada-brisanet.png';

function ThemedApp() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = jangadaLogo;
    document.title = 'brisaBLOW';
  }, []);

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
