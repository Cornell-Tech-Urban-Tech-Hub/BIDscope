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
      const baseUrl = typeof window !== 'undefined' && window.BIDMapContext?.getBasePath ? 
        window.BIDMapContext.getBasePath() : '/';
      
      console.log(`MapEventManager: Navigating to BID project ${bidName} (${projectSlug})`);
      window.location.href = `${baseUrl}/bids/${projectSlug}`;
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
