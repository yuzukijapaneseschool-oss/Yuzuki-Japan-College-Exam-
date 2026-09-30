import React from 'react';
import logoImg from '../assets/logo.png';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[YUZUKI ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-japanese">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center mx-auto">
              <img src={logoImg} alt="YUZUKI Japan College" className="w-12 h-12 object-contain" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Portal Render Recovery</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Something went wrong</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                An unexpected interface error occurred. You can reload the page or return to your student dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page (නැවත උත්සාහ කරන්න)</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>My Dashboard</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <a
                href="https://wa.me/94773539800?text=Hello%20Sensei,%20I%20encountered%20an%20issue%20on%20the%20Yuzuki%20Exam%20Portal."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Need help? Contact Sensei on WhatsApp</span>
              </a>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="text-left bg-slate-950 p-3 rounded-xl text-[11px] text-slate-400 font-mono overflow-auto max-h-40 border border-slate-800">
                <summary className="cursor-pointer text-slate-500 hover:text-slate-300 mb-1">Error Details</summary>
                <p className="text-rose-400 font-bold">{this.state.error.toString()}</p>
                <pre className="mt-1 text-[10px] whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
