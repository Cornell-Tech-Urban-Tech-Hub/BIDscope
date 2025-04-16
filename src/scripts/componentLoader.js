// Create this file to handle dynamic component loading

export async function loadComponent(componentPath) {
  try {
    // Detect file type based on extension
    const fileExtension = componentPath.split('.').pop().toLowerCase();
    
    // Handle different file types
    switch (fileExtension) {
      // Image handling
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
      
      // React/TypeScript component files
      case 'jsx':
      case 'tsx':
      case 'js':
      case 'ts':
        // Use the import() function to dynamically load the component
        const normalizedPath = componentPath.replace(/^src\//, '../');
        const module = await import(/* @vite-ignore */ normalizedPath);
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
    return null;
  }
}

// Helper function to create an image element
function createImageElement(path) {
  const img = document.createElement('img');
  img.src = path;
  img.loading = 'lazy';
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