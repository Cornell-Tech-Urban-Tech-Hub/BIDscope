/**
 * Map event handler utility to provide a more reliable event system
 * for map navigation and interactions
 */

// Create a synchronous event system
class MapEventManager {
  constructor() {
    this.handlers = {};
    this.setupGlobalHandler();
  }
  
  setupGlobalHandler() {
    // Clean up any existing handlers first to prevent duplicates
    if (typeof window !== 'undefined') {
      window.removeEventListener('map-navigate-to-bid', this._navigationHandler);
    }
    
    // Store the handler as a property to allow proper removal
    this._navigationHandler = (event) => {
      const { mapId, bidName } = event.detail || {};
      
      // Check if the map's DOM element still exists before handling event
      if (mapId && typeof document !== 'undefined') {
        const mapContainer = document.getElementById(`map-container-${mapId}`);
        if (!mapContainer) {
          console.log(`MapEventManager: Ignoring event for non-existent map: ${mapId}`);
          return;
        }
      }
      
      if (mapId && bidName && this.handlers[mapId]) {
        console.log(`MapEventManager: Navigation to BID ${bidName} on map ${mapId}`);
        this.handlers[mapId](bidName);
      } else {
        if (!mapId) console.warn('MapEventManager: Missing mapId in event');
        if (!bidName) console.warn('MapEventManager: Missing bidName in event');
        if (mapId && !this.handlers[mapId]) console.warn(`MapEventManager: No handler for ${mapId}`);
      }
    };
    
    // Listen for the custom map navigation event
    if (typeof window !== 'undefined') {
      window.addEventListener('map-navigate-to-bid', this._navigationHandler);
      
      // Make the manager available globally
      window.MapEventManager = this;
      
      // Set up initialization check
      document.addEventListener('DOMContentLoaded', () => {
        console.log('MapEventManager: Ready to handle map navigation events');
        this._isReady = true;
      });
    }
  }
  
  registerNavigationHandler(mapId, handler) {
    if (typeof handler === 'function') {
      this.handlers[mapId] = handler;
      console.log(`MapEventManager: Registered handler for ${mapId}`);
      return true;
    }
    return false;
  }
  
  unregisterHandler(mapId) {
    if (this.handlers[mapId]) {
      delete this.handlers[mapId];
      return true;
    }
    return false;
  }
  
  // Helper method to manually trigger navigation
  navigateToBid(mapId, bidName) {
    if (typeof window !== 'undefined') {
      console.log(`MapEventManager: Manually triggering navigation to ${bidName} on ${mapId}`);
      const event = new CustomEvent('map-navigate-to-bid', {
        detail: { mapId, bidName }
      });
      window.dispatchEvent(event);
      return true;
    }
    return false;
  }

  // Helper method to navigate directly to a BID project
  navigateToBidProject(bidName, bidToSlugMap) {
    if (!bidName || !bidToSlugMap || !bidToSlugMap[bidName]) {
      console.warn(`MapEventManager: Cannot navigate to BID project: missing slug for ${bidName}`);
      return false;
    }
    
    try {
      const projectSlug = bidToSlugMap[bidName];
      
      // Get base path using same method as in MapVisualizer
      const getBasePath = () => {
        // Check for base path in Astro configuration
        if (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) {
          return import.meta.env.BASE_URL;
        }
        
        // Fallback approach for client-side detection
        if (typeof document !== 'undefined') {
          const baseElement = document.querySelector('base');
          if (baseElement && baseElement.href) {
            try {
              const url = new URL(baseElement.href);
              const pathParts = url.pathname.split('/').filter(Boolean);
              if (pathParts.length > 0) {
                return `/${pathParts.join('/')}`;
              }
            } catch (e) {
              console.warn('Error parsing base URL:', e);
            }
          }
          
          // Check for Astro's script data
          const astroData = document.querySelector('script[data-astro-repo-base]');
          if (astroData && astroData.dataset.astroRepoBase) {
            return astroData.dataset.astroRepoBase;
          }
        }

        
        return '/';
      };
      
      const baseUrl = getBasePath();
      
      console.log(`MapEventManager: Navigating to BID project ${bidName} (${projectSlug}) at ${baseUrl}/projects/${projectSlug}`);
      window.location.href = `${baseUrl}/projects/${projectSlug}`;
      return true;
    } catch (error) {
      console.error(`MapEventManager: Error navigating to BID project ${bidName}:`, error);
      return false;
    }
  }
}

// Create a singleton instance
const mapEventManager = new MapEventManager();

export default mapEventManager;
