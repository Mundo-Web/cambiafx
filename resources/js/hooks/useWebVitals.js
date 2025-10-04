import { useEffect } from 'react';
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';

/**
 * Custom hook to measure and report Web Vitals
 * Integrates with Google Analytics, Auditzy, or custom endpoint
 * 
 * @param {Function} onReport - Callback to handle metric reporting
 */
export const useWebVitals = (onReport) => {
  useEffect(() => {
    // Measure all Web Vitals
    onCLS(onReport);
    onFCP(onReport);
    onFID(onReport); // Legacy - will be replaced by INP
    onINP(onReport);
    onLCP(onReport);
    onTTFB(onReport);
  }, [onReport]);
};

/**
 * Report Web Vitals to Google Analytics
 * 
 * @param {Object} metric - Web Vital metric object
 */
export const reportWebVitalsToGA = (metric) => {
  const { name, value, id, delta, rating } = metric;

  // Send to Google Analytics 4
  if (window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      metric_delta: Math.round(name === 'CLS' ? delta * 1000 : delta),
      metric_rating: rating,
      non_interaction: true,
    });
  }

  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(value),
      rating,
      delta: Math.round(delta),
    });
  }
};

/**
 * Report Web Vitals to custom endpoint (e.g., Auditzy)
 * 
 * @param {Object} metric - Web Vital metric object
 */
export const reportWebVitalsToEndpoint = (metric) => {
  const { name, value, id, delta, rating, navigationType } = metric;

  const body = JSON.stringify({
    metric_name: name,
    metric_value: value,
    metric_id: id,
    metric_delta: delta,
    metric_rating: rating,
    navigation_type: navigationType,
    page_url: window.location.href,
    user_agent: navigator.userAgent,
    timestamp: Date.now(),
  });

  // Send to your analytics endpoint
  const url = '/api/web-vitals'; // Adjust to your endpoint

  // Use sendBeacon if available (non-blocking)
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    // Fallback to fetch
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to report Web Vitals:', error);
    });
  }
};

/**
 * Get rating color based on Web Vitals thresholds
 * 
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @returns {string} - Color (good, needs-improvement, poor)
 */
export const getMetricRating = (name, value) => {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FCP: { good: 1800, poor: 3000 },
    CLS: { good: 0.1, poor: 0.25 },
    FID: { good: 100, poor: 300 },
    INP: { good: 200, poor: 500 },
    TTFB: { good: 800, poor: 1800 },
  };

  const threshold = thresholds[name];
  if (!threshold) return 'unknown';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

/**
 * Format metric value for display
 * 
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @returns {string} - Formatted value
 */
export const formatMetricValue = (name, value) => {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)} ms`;
};

/**
 * Initialize Web Vitals monitoring
 * Call this in your main app component
 */
export const initWebVitalsMonitoring = () => {
  // Report to Google Analytics
  onCLS(reportWebVitalsToGA);
  onFCP(reportWebVitalsToGA);
  onFID(reportWebVitalsToGA);
  onINP(reportWebVitalsToGA);
  onLCP(reportWebVitalsToGA);
  onTTFB(reportWebVitalsToGA);

  // Optionally report to custom endpoint
  // onCLS(reportWebVitalsToEndpoint);
  // onFCP(reportWebVitalsToEndpoint);
  // onINP(reportWebVitalsToEndpoint);
  // onLCP(reportWebVitalsToEndpoint);
  // onTTFB(reportWebVitalsToEndpoint);
};

export default useWebVitals;
