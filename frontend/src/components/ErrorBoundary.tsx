import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in NavikaAI React tree:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#151926',
          color: '#f1f5fb',
          padding: '2rem',
          fontFamily: "'Roboto', sans-serif",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            maxWidth: '650px',
            width: '100%',
            border: '1px solid rgba(83, 121, 174, 0.35)',
            backgroundColor: '#181e2e',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 12px 36px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#0474C4',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              NAVIKA AI // SYSTEM RECOVERY
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 1rem 0', color: '#ffffff' }}>
              Interface Diagnostic Notice
            </h1>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '1.5rem', color: '#A8C4EC' }}>
              An interface component encountered an error during initialization. The multi-agent cognition pipeline and edge telemetry remain intact.
            </p>
            {this.state.error && (
              <pre style={{
                backgroundColor: '#0f131d',
                border: '1px solid rgba(83, 121, 174, 0.25)',
                borderRadius: '8px',
                padding: '1rem',
                fontSize: '11px',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                color: '#f87171',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => {
                try { localStorage.clear(); } catch (_) {}
                window.location.reload();
              }}
              style={{
                backgroundColor: '#0474C4',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 22px',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              RELOAD APPLICATION
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
