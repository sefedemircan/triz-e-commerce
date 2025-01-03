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
import { ErrorBoundary } from './components/ErrorBoundary';

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
          backgroundColor: 'var(--mantine-color-body)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
          }
        }
      }
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm'
      },
      styles: {
        root: {
          backgroundColor: 'var(--mantine-color-body)'
        }
      }
    },
    AppShell: {
      styles: {
        main: {
          backgroundColor: 'var(--mantine-color-gray-0)'
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
    },
    NavLink: {
      styles: {
        root: {
          '&[data-active]': {
            backgroundColor: 'var(--mantine-color-orange-6)',
            color: 'var(--mantine-color-white)'
          }
        }
      }
    }
  },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#1A1B1E',
  defaultGradient: {
    from: 'orange',
    to: 'red',
    deg: 45
  }
});

// Servis worker'ı kaydet
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        // Service worker başarıyla kaydedildi
      })
      .catch(() => {
        // Service worker kaydı başarısız
      });
  });
}

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <ErrorBoundary>
      <MantineProvider 
        theme={theme} 
        defaultColorScheme="light"
        forceColorScheme="light"
        defaultProps={{
          Container: {
            sizes: {
              xs: 540,
              sm: 720,
              md: 960,
              lg: 1140,
              xl: 1320
            }
          }
        }}
      >
        <Notifications position="top-right" zIndex={1000} />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
          <AIChat />
        </BrowserRouter>
      </MantineProvider>
    </ErrorBoundary>
  );
}

export default App;
