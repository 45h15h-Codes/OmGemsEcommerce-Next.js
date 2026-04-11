"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — Phase 6 UI Hardening
 *
 * Catches JavaScript errors in any child component tree and renders
 * a polished fallback UI instead of crashing the entire page.
 * Styled consistently with the premium dark-mode design system.
 */
export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 animate-in fade-in duration-500">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-red-500/30">
              <AlertTriangle className="h-10 w-10 text-white" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 text-center max-w-md">
            An unexpected error occurred. Please try again or contact support if
            the issue persists.
          </p>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="mb-6 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 text-xs text-red-500 dark:text-red-400 max-w-lg overflow-auto border border-zinc-200 dark:border-zinc-700">
              {this.state.error.message}
            </pre>
          )}

          <button
            onClick={this.handleRetry}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
