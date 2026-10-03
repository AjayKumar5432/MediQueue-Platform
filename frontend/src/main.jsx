import { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

if (typeof window !== 'undefined' && !window.global) {
  window.global = window;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", fontFamily: "sans-serif", backgroundColor: "#FEF2F2", color: "#991B1B", minHeight: "100vh" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>⚠️ Application Error Encountered</h2>
          <p style={{ marginBottom: "20px", fontWeight: "bold" }}>{this.state.error?.toString()}</p>
          <pre style={{ background: "#FFFFFF", padding: "15px", borderRadius: "8px", overflowX: "auto", border: "1px solid #FCA5A5", fontSize: "0.85rem" }}>
            {this.state.errorInfo?.componentStack || this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: "20px", padding: "10px 20px", background: "#991B1B", color: "#FFF", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

// Progressive Web App (PWA) Service Worker Registration
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('MediQueue PWA Service Worker active:', reg.scope);
      })
      .catch((err) => {
        console.warn('MediQueue PWA Service Worker registration skipped:', err);
      });
  });
}

