import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from './routes';
import { useAuthStore } from './stores/authStore';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import AIChat from './components/AIChat';

// Özel tema oluşturuyoruz
const theme = createTheme({
  primaryColor: 'orange',
  colors: {
    // Ana renk paleti
    orange: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd8a8',
      '#ffc078',
      '#ffa94d',
      '#ff922b',
      '#fd7e14',
      '#f76707',
      '#e8590c',
      '#d9480f'
    ]
  },
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    sizes: {
      h1: { fontSize: '3rem', fontWeight: '900', lineHeight: 1.2 },
      h2: { fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.3 },
      h3: { fontSize: '2rem', fontWeight: '700', lineHeight: 1.4 }
    }
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
        size: 'md'
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm'
      },
      styles: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
          }
        }
      }
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'md'
      }
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
        size: 'md'
      }
    }
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#1A1B1E'
});

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <MantineProvider theme={theme} defaultProps={{
      Container: {
        sizes: {
          xs: 540,
          sm: 720,
          md: 960,
          lg: 1140,
          xl: 1320
        }
      }
    }}>
      <Notifications position="top-right" zIndex={1000} />
      <BrowserRouter>
        <AppRoutes />
        <AIChat />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
