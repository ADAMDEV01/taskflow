import { Component, type ErrorInfo, type ReactNode } from 'react'
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Taskflow UI error', error, info.componentStack) }
  render() {
    if (this.state.failed) return <main className="fatal-error" role="alert"><h1>Something went wrong.</h1><p>Your saved data remains in your browser or Supabase.</p><button className="button primary" onClick={() => location.reload()}>Reload Taskflow</button></main>
    return this.props.children
  }
}
