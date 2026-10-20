import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FEFBF1] dark:bg-[#0F100F] text-[#0F100F] dark:text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#161716] rounded-3xl p-8 border border-black/10 dark:border-white/10 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-[#AC7900] dark:text-[#D4AF37] flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl font-bold font-editorial">Studio Display Recovery</h2>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              We encountered a display issue while loading the interactive canvas. Click below to refresh or return to the mill catalogue safely.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '#home';
                  window.location.reload();
                }}
                className="px-5 py-2.5 rounded-full bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold hover:scale-105 transition flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>

              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-black/10 transition flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
