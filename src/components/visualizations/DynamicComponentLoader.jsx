import React, { useState, useEffect } from 'react';

// Enhanced component loader for full-width visualizations
const DynamicComponentLoader = ({ componentPath, fullWidth = true, ...props }) => {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function loadComponent() {
      try {
        // Remove the "src/" prefix since imports are relative to src directory
        const normalizedPath = componentPath.replace(/^src\//, '../');
        const module = await import(/* @vite-ignore */ normalizedPath);
        
        if (isMounted) {
          setComponent(() => module.default);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading component:', err);
          setError(err);
          setLoading(false);
        }
      }
    }

    loadComponent();
    
    return () => {
      isMounted = false;
    };
  }, [componentPath]);

  const containerStyles = {
    width: '100%',
    height: '100%',
    minHeight: '500px',
    ...(fullWidth ? { maxWidth: 'none', position: 'relative' } : {})
  };

  if (loading) {
    return (
      <div className="loading-indicator" style={containerStyles}>
        <div>Loading visualization...</div>
      </div>
    );
  }

  if (error || !Component) {
    return (
      <div className="error-placeholder" style={containerStyles}>
        <p>Error loading visualization component. Please check the console for details.</p>
      </div>
    );
  }

  // Wrap in a div that ensures the component gets the correct sizing
  return (
    <div className={`viz-component-container ${fullWidth ? 'full-width-viz' : ''}`} style={containerStyles}>
      <Component {...props} fullWidth={fullWidth} />
    </div>
  );
};

export default DynamicComponentLoader;