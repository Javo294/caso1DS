import React from 'react';
import * as Sentry from '@sentry/react';
import { BaseException } from './BaseException';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AppErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry
    Sentry.captureException(error, { extra: errorInfo });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private renderFallback() {
    const { fallback: FallbackComponent } = this.props;
    const { error } = this.state;

    if (FallbackComponent) {
      return <FallbackComponent error={error!} />;
    }

    return (
      <div className="error-boundary">
        <h2>Something went wrong</h2>
        <p>{error?.message}</p>
        {error instanceof BaseException && (
          <details>
            <summary>Error details</summary>
            <pre>{JSON.stringify(error.toJSON(), null, 2)}</pre>
          </details>
        )}
        <button onClick={this.handleReset}>Try again</button>
      </div>
    );
  }

  public render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;

// Usage example:
/*
// In main App.tsx
import AppErrorBoundary from '@/exceptions/AppErrorBoundary';

function App() {
  return (
    <AppErrorBoundary fallback={ErrorFallback}>
      <Router>
        <AppRoutes />
      </Router>
    </AppErrorBoundary>
  );
}
*/
