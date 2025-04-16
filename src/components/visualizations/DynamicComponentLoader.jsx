import React, { useEffect, useState, useRef } from 'react';
import { loadComponent } from '../../scripts/componentLoader.js';

const DynamicComponentLoader = ({ componentPath, fullWidth = false }) => {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAstroImage, setIsAstroImage] = useState(false);
  const [isYouTubeEmbed, setIsYouTubeEmbed] = useState(false);
  const [youTubeId, setYouTubeId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadAndRenderComponent = async () => {
      if (!componentPath) {
        setLoading(false);
        return;
      }
      
      // Direct handling for YouTube URLs
      if (componentPath.includes('youtube.com') || componentPath.includes('youtu.be')) {
        setIsYouTubeEmbed(true);
        // Extract video ID using a simple regex pattern
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = componentPath.match(youtubeRegex);
        if (match && match[1]) {
          setYouTubeId(match[1]);
          setLoading(false);
          return;
        }
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

  // For YouTube embeds, render directly in React
  if (isYouTubeEmbed && youTubeId) {
    return (
      <div className="youtube-embed-container" style={{
        position: 'relative',
        width: '100%',
        height: '0',
        paddingBottom: '56.25%', // 16:9 aspect ratio
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        <iframe
          src={`https://www.youtube.com/embed/${youTubeId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    );
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