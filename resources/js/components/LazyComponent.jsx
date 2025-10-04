import React, { Suspense } from 'react';

/**
 * Higher Order Component for lazy loading React components
 * with error boundary and loading fallback
 * 
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Configuration options
 * @returns {React.Component}
 */
export const LazyComponent = (importFunc, options = {}) => {
  const {
    fallback = <LoadingFallback />,
    errorFallback = <ErrorFallback />,
    delay = 200, // Delay before showing loading state
  } = options;

  const LazyLoadedComponent = React.lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        importFunc().then(resolve);
      }, delay);
    });
  });

  return (props) => (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        <LazyLoadedComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

/**
 * Default loading fallback component
 */
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

/**
 * Default error fallback component
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
    <div className="text-red-500 mb-4">
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <p className="text-gray-600 mb-4">Hubo un error al cargar este componente</p>
    {resetErrorBoundary && (
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
      >
        Reintentar
      </button>
    )}
  </div>
);

/**
 * Error Boundary component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LazyComponent Error:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return React.cloneElement(this.props.fallback, {
        error: this.state.error,
        resetErrorBoundary: this.resetErrorBoundary,
      });
    }

    return this.props.children;
  }
}

/**
 * Preload function for lazy components
 * Call this on hover or route change for better UX
 * 
 * @param {Function} importFunc - Same import function passed to LazyComponent
 */
export const preloadComponent = (importFunc) => {
  importFunc();
};

/**
 * Custom hook for intersection observer (lazy load on scroll)
 */
export const useLazyLoad = (callback, options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
  } = options;

  const ref = React.useRef(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, threshold, rootMargin]);

  return ref;
};

export default LazyComponent;
