// Create this file to handle dynamic component loading

export async function loadComponent(componentPath) {
  try {
    console.log(`Loading component with path: ${componentPath}`);
    
    // Special handling for YouTube URLs
    if (componentPath.includes('youtube.com') || componentPath.includes('youtu.be')) {
      return createYouTubeEmbed(componentPath);
    }
    
    // Special handling for iframe format (iframe:URL)
    if (componentPath.startsWith('iframe:')) {
      return createIframeElement(componentPath.substring(7));
    }
    
    // Handle relative paths starting with ../../
    let processedPath = componentPath;
    if (componentPath.startsWith('../../')) {
      // Leave as-is - we'll handle it directly in import statements
      console.log(`Using relative path as specified: ${componentPath}`);
      processedPath = componentPath;
    }
    
    // Fix URLs that incorrectly include 'src' in the path
    if (processedPath.includes('/src/')) {
      processedPath = processedPath.replace('/src/', '/');
      console.log(`Fixed path by removing 'src': ${processedPath}`);
    } else if (processedPath.startsWith('src/')) {
      processedPath = processedPath.replace('src/', '');
      console.log(`Fixed path by removing 'src': ${processedPath}`);
    }
    
    // Detect file type based on extension
    const fileExtension = processedPath.split('.').pop().toLowerCase();
    
    // For images within src directory, let Astro handle it specially
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExtension) && 
        (processedPath.includes('/components/') || processedPath.includes('/assets/') || processedPath.startsWith('../../'))) {
      // Instead of trying to create an image element directly,
      // return an object that signals this is an image to be processed by Astro
      return {
        type: 'astro-image',
        path: processedPath
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
      
      // Markdown files
      case 'md':
      case 'markdown':
        return handleMarkdownContent(processedPath);
      
      // React/TypeScript component files
      case 'jsx':
      case 'tsx':
      case 'js':
      case 'ts': 
        // Use the relative path directly for dynamic import - important!
        console.log(`Importing JSX/TSX component: ${processedPath}`);
        try {
          const module = await import(/* @vite-ignore */ processedPath);
          return module.default;
        } catch (importError) {
          console.error(`Module import error for ${processedPath}:`, importError);
          // Try alternative import path structure if original fails
          const altPath = processedPath.startsWith('/') ? processedPath.substring(1) : `/${processedPath}`;
          console.log(`Trying alternative path: ${altPath}`);
          const module = await import(/* @vite-ignore */ altPath);
          return module.default;
        }
        
      // Default: try to load as a JavaScript module
      default:
        console.warn(`Unknown file type: ${fileExtension}, attempting to load as module`);
        const defaultModule = await import(/* @vite-ignore */ processedPath);
        return defaultModule.default;
    }
  } catch (error) {
    console.error(`Failed to load component: ${componentPath}`, error);
    return createErrorElement(`Failed to load: ${componentPath} (${error.message})`);
  }
}

// Helper function to create an image element
function createImageElement(path) {
  const img = document.createElement('img');
  img.src = path;
  img.loading = 'lazy';
  img.style.maxWidth = '100%';
  img.alt = 'Visualization image'; // Add basic accessibility
  return img;
}

// Helper function to normalize public URLs to avoid 'src' in path
function normalizePublicUrl(url) {
  // For URLs that should point to public directory
  if (url.includes('/src/')) {
    return url.replace('/src/', '/');
  } else if (url.startsWith('src/')) {
    return url.replace('src/', '');
  }
  return url;
}

// Helper function to create a video element
function createVideoElement(path) {
  const video = document.createElement('video');
  video.src = path;
  video.controls = true;
  video.style.maxWidth = '100%';
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
  } else {
    iframe.title = "Embedded content"; // Basic accessibility
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

// Handle markdown content (new)
async function handleMarkdownContent(path) {
  try {
    // Try to fetch the markdown content
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const markdownContent = await response.text();
    
    // Create container for markdown
    const container = document.createElement('div');
    container.className = 'markdown-content';
    
    // If 'marked' library is available globally, use it to parse markdown
    if (typeof window.marked !== 'undefined') {
      container.innerHTML = window.marked.parse(markdownContent);
    } else {
      // Basic fallback markdown rendering (very simple)
      const htmlContent = markdownContent
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        // Code
        .replace(/`(.*)`/gim, '<code>$1</code>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
        // Paragraphs
        .replace(/^\s*(\n)?(.+)/gim, function(m) {
          return /^<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>'+m+'</p>';
        })
        // Line breaks
        .replace(/\n$/gim, '<br />');
      
      container.innerHTML = htmlContent;
    }
    
    return container;
  } catch (error) {
    console.error(`Failed to load markdown: ${path}`, error);
    return createErrorElement(`Failed to load markdown: ${path}`);
  }
}
