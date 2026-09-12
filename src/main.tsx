import {Component, StrictMode} from 'react';
import type {ErrorInfo, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends Component<{children: ReactNode}, {error: Error | null}> {
  state = {error: null as Error | null};

  static getDerivedStateFromError(error: Error) {
    return {error};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error de aplicación:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#f5f5f4', padding: '1.5rem', fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{
            maxWidth: '480px', width: '100%', background: '#fff', borderRadius: '1rem',
            border: '1px solid #fcd34d', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          }}>
            <h1 style={{margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#b45309'}}>Ocurrió un error inesperado</h1>
            <p style={{margin: '0 0 1rem', fontSize: '0.85rem', color: '#57534e'}}>
              {this.state.error.message || String(this.state.error)}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#d97706', color: '#fff', border: 'none', borderRadius: '0.5rem',
                padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
