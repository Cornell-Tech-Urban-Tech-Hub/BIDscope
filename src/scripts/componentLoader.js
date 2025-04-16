// Create this file to handle dynamic component loading

export async function loadComponent(componentPath) {
  try {
    // Special handling for iframe format (iframe:URL)
    if (componentPath.startsWith('iframe:')) {
      return createIframeElement(componentPath.substring(7));
    }
    
    // Detect file type based on extension
    const fileExtension = componentPath.split('.').pop().toLowerCase();
    
    // For images within src directory, let Astro handle it specially
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExtension) && 
        (componentPath.includes('/src/') || componentPath.startsWith('src/'))) {
      // Instead of trying to create an image element directly,
      // return an object that signals this is an image to be processed by Astro
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
        return createImageElement(componentPath);
      
      // Video handling
      case 'mp4':
      case 'webm':
      case 'ogg':
        return createVideoElement(componentPath);
        
      // Special handlers for embeds
      case 'youtube':
        return createYouTubeEmbed(componentPath);
      
      // Iframe configuration file
      case 'iframe':
        return handleIframeConfig(componentPath);
      
      // React/TypeScript component files
      case 'jsx':
      case 'tsx':
      case 'js':
      case 'ts':
        // Use the import() function to dynamically load the component
        const jsPath = componentPath.replace(/^src\//, '../');
        const module = await import(/* @vite-ignore */ jsPath);
        return module.default;
        
      // Default: try to load as a JavaScript module
      default:
        console.warn(`Unknown file type: ${fileExtension}, attempting to load as module`);
        const defaultPath = componentPath.replace(/^src\//, '../');
        const defaultModule = await import(/* @vite-ignore */ defaultPath);
        return defaultModule.default;
    }
  } catch (error) {
    console.error(`Failed to load component: ${componentPath}`, error);
    return createErrorElement(`Failed to load: ${componentPath}`);
  }
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

// Helper function for YouTube embeds
function createYouTubeEmbed(path) {
  // Expect path format: youtube:VIDEO_ID or a full URL
  const videoId = path.includes('youtube:') 
    ? path.split('youtube:')[1]
    : extractYouTubeId(path);
    
  if (!videoId) return null;
  
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.width = "560";
  iframe.height = "315";
  iframe.frameBorder = "0";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  
  return iframe;
}

// Helper to extract YouTube ID from various URL formats
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
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

// Helper function to normalize paths for the browser
function normalizePath(path) {
  // If this is a path to an asset in the src directory, 
  // don't modify it - it will be handled by Astro's special import
  if (path.includes('/src/') || path.startsWith('src/')) {
    return path;
  }
  
  // If path does not start with a slash or http, add one
  if (!path.startsWith('/') && !path.startsWith('http')) {
    return '/' + path;
  }
  
  return path;
}