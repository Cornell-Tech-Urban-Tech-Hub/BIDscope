// Create this file to handle dynamic component loading

export async function loadComponent(componentPath) {
  try {
    // Get the base URL from environment
    const baseUrl = import.meta.env.BASE_URL || '/';
    
    console.log(`Loading component with path: ${componentPath}`);
    
    // Special handling for YouTube URLs
    if (componentPath.includes('youtube.com') || componentPath.includes('youtu.be')) {
      return createYouTubeEmbed(componentPath);
    }
    
    // Special handling for iframe format (iframe:URL)
    if (componentPath.startsWith('iframe:')) {
      return createIframeElement(componentPath.substring(7));
    }
    
    // Process path with base URL if needed
    let processedPath = componentPath;
    
    // If it's a relative path and doesn't already include the base URL, add it
    if (!processedPath.startsWith('http') && !processedPath.startsWith('//') && 
        !processedPath.startsWith('/') && !processedPath.startsWith(baseUrl)) {
      processedPath = `${baseUrl}${processedPath}`;
    }
    // For paths starting with '/' but not the baseUrl, add the base URL
    else if (processedPath.startsWith('/') && baseUrl !== '/' && !processedPath.startsWith(baseUrl)) {
      processedPath = `${baseUrl}${processedPath.substring(1)}`;
    }
    
    console.log(`Processed path: ${processedPath}`);
    
    // Detect file type based on extension
    const fileExtension = componentPath.split('.').pop().toLowerCase();
    
    // For images within src directory, let Astro handle it specially
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExtension) && 
        (componentPath.includes('/src/') || componentPath.startsWith('src/') || componentPath.startsWith('../../'))) {
      // Pass the original path for Astro to handle
      return {
        type: 'astro-image',
        path: componentPath
      };
    }
    
    // Handle different file types
    switch (fileExtension) {
      // Image handling (for images not in src directory)
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return createImageElement(processedPath);
      
      // Video handling
      case 'mp4':
      case 'webm':
      case 'ogg':
        return createVideoElement(processedPath);
        
      // Special handlers for embeds
      case 'youtube':
        return createYouTubeEmbed(processedPath);
      
      // Iframe configuration file
      case 'iframe':
        return handleIframeConfig(processedPath);
      
      // React/TypeScript component files
      case 'jsx':
      case 'tsx':
      case 'js':
      case 'ts': 
        // Using dynamic import to load the component
        try {
          // For import statements, we need to handle base URL differently
          let importPath = processedPath;
          
          // If it's an absolute path starting with the base URL, we need to
          // ensure it's correctly formatted for import
          if (baseUrl !== '/' && importPath.startsWith(baseUrl)) {
            // For client-side imports, we might need to adjust the path
            // depending on how the bundler handles imports
            const pathWithoutBase = importPath.substring(baseUrl.length);
            
            // Try different import strategies
            try {
              // Try with the full processed path first
              return await attemptImport(importPath);
            } catch (e) {
              // If that fails, try with path relative to base
              try {
                return await attemptImport(`/${pathWithoutBase}`);
              } catch (e2) {
                // If that fails too, try with just the path
                return await attemptImport(pathWithoutBase);
              }
            }
          } 
          
          // Regular import for non-baseUrl paths
          return await attemptImport(importPath);
        } catch (importError) {
          console.error(`Failed to import component: ${processedPath}`, importError);
          throw new Error(`Failed to import component: ${importError.message}`);
        }
    }
  } catch (error) {
    console.error(`Failed to load component: ${componentPath}`, error);
    return createErrorElement(`Failed to load: ${componentPath} (${error.message})`);
  }
}

// Helper function to attempt import with different strategies
async function attemptImport(path) {
  console.log(`Attempting to import: ${path}`);
  const module = await import(/* @vite-ignore */ path);
  return module.default || module;
}

// Helper function to create an image element
function createImageElement(path) {
  const img = document.createElement('img');
  img.src = path;
  img.loading = 'lazy';
  img.style.maxWidth = '100%';
  return img;
}

// Helper function to create a video element
function createVideoElement(path) {
  const video = document.createElement('video');
  video.src = path;
  video.controls = true;
  return video;
}

// Helper function for YouTube embeds - IMPROVED VERSION
function createYouTubeEmbed(path) {
  // Extract the video ID from various YouTube URL formats
  const videoId = extractYouTubeId(path);
    
  if (!videoId) {
    console.error('Could not extract YouTube video ID from:', path);
    return createErrorElement(`Invalid YouTube URL: ${path}`);
  }
  
  // Create a container div for the embed
  const container = document.createElement('div');
  container.className = 'youtube-embed-container';
  container.style.position = 'relative';
  container.style.width = '100%';
  container.style.height = '0';
  container.style.paddingBottom = '56.25%'; // 16:9 aspect ratio
  container.style.overflow = 'hidden';
  container.style.marginBottom = '1rem';
  
  // Create the iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.title = 'YouTube video player';
  iframe.frameBorder = '0';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  
  // Style the iframe for responsive embed
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  
  // Add iframe to container
  container.appendChild(iframe);
  
  return container;
}

// Helper to extract YouTube ID from various URL formats - IMPROVED VERSION
function extractYouTubeId(url) {
  // Handle youtu.be short links
  if (url.includes('youtu.be/')) {
    const idMatch = url.match(/youtu\.be\/([^?&#]+)/);
    return idMatch ? idMatch[1] : null;
  }
  
  // Handle standard youtube.com links
  if (url.includes('youtube.com/')) {
    // Watch URLs
    if (url.includes('watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      return urlParams.get('v');
    }
    
    // Embed URLs
    if (url.includes('/embed/')) {
      const idMatch = url.match(/\/embed\/([^?&#]+)/);
      return idMatch ? idMatch[1] : null;
    }
    
    // Shortened URLs
    if (url.includes('/v/')) {
      const idMatch = url.match(/\/v\/([^?&#]+)/);
      return idMatch ? idMatch[1] : null;
    }
  }
  
  // Handle case where the raw video ID is passed
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  return null;
}

// Helper function to create a generic iframe element
function createIframeElement(url, options = {}) {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  
  // Apply default settings
  iframe.width = options.width || "100%";
  iframe.height = options.height || "500px";
  iframe.frameBorder = options.frameBorder || "0";
  
  // Security settings
  if (options.sandbox !== false) {
    iframe.sandbox = options.sandbox || "allow-scripts allow-same-origin allow-forms";
  }
  
  // Additional attributes
  if (options.allowFullscreen) {
    iframe.allowFullscreen = true;
  }
  
  if (options.title) {
    iframe.title = options.title;
  }
  
  // Add any custom styles
  if (options.style) {
    Object.assign(iframe.style, options.style);
  }
  
  return iframe;
}

// Helper to create an error message element
function createErrorElement(message) {
  const div = document.createElement('div');
  div.className = 'viz-error';
  div.textContent = message;
  div.style.padding = '1rem';
  div.style.color = 'red';
  div.style.border = '1px solid red';
  div.style.borderRadius = '4px';
  return div;
}

// Handle iframe config files (.iframe)
async function handleIframeConfig(configPath) {
  try {
    const normalizedPath = configPath.replace(/^src\//, '/');
    const config = await import(/* @vite-ignore */ normalizedPath);
    
    if (!config.url) {
      throw new Error('Iframe configuration must contain a URL');
    }
    
    return createIframeElement(config.url, config);
  } catch (error) {
    console.error(`Failed to load iframe config: ${configPath}`, error);
    return createErrorElement(`Failed to load iframe config: ${configPath}`);
  }
}
