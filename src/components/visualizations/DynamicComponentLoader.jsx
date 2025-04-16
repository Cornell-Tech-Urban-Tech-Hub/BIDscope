import React, { useEffect, useState, useRef } from 'react';
import { loadComponent } from '../../scripts/componentLoader.js';

const DynamicComponentLoader = ({ componentPath, fullWidth = false }) => {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAstroImage, setIsAstroImage] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadAndRenderComponent = async () => {
      if (!componentPath) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const result = await loadComponent(componentPath);
        
        if (!isMounted) return;
        
        // Check if this is an Astro Image (handled by parent component)
        if (result && result.type === 'astro-image') {
          setIsAstroImage(true);
          setComponent(null);
        } else if (result instanceof Element) {
          // If loadComponent returned a DOM element (like an img or iframe)
          if (containerRef.current) {
            // Clear previous content
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(result);
          }
          setComponent(null); // No React component to render
        } else {
          // It's a React component
          setIsAstroImage(false);
          setComponent(() => result);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to load component:", err);
        if (isMounted) {
          setError(`Failed to load ${componentPath}: ${err.message}`);
          setIsAstroImage(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadAndRenderComponent();
    
    return () => {
      isMounted = false;
    };
  }, [componentPath]);

  if (loading) {
    return <div className="viz-loading">Loading visualization...</div>;
  }

  if (error) {
    return <div className="viz-error">{error}</div>;
  }

  // For Astro images, return a placeholder that will be replaced
  if (isAstroImage) {
    return (
      <div className={`astro-image-placeholder ${fullWidth ? 'full-width' : ''}`} data-path={componentPath}>
        {/* This will be replaced by Astro's Image component */}
        <div style={{ textAlign: 'center', padding: '2rem' }}>Image loading via Astro...</div>
      </div>
    );
  }

  // For DOM elements (rendered via ref)
  if (!Component) {
    return (
      <div 
        ref={containerRef} 
        className={`viz-container-dom ${fullWidth ? 'full-width' : ''}`}
      />
    );
  }

  // For React components
  return <Component />;
};

export default DynamicComponentLoader;