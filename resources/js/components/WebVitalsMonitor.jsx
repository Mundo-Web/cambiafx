import React, { useEffect } from 'react';
import { initWebVitalsMonitoring } from '../hooks/useWebVitals';

/**
 * Web Vitals Monitor Component
 * Add this component to your main layout to start monitoring
 */
const WebVitalsMonitor = () => {
  useEffect(() => {
    // Initialize Web Vitals monitoring when component mounts
    initWebVitalsMonitoring();
  }, []);

  // This component doesn't render anything
  return null;
};

export default WebVitalsMonitor;
