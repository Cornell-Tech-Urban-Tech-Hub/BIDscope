/**
 * Map cleanup utility to ensure proper cleanup of map resources during navigation
 */

class MapCleanupManager {
  constructor() {
    this.maps = new Map();
    this.overlays = new Map();
    this.destroyedMaps = new Set(); // Track already destroyed maps
    this.setupCleanupHooks();
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.lastCleanupTime = 0;
    this.cleanupThrottleTime = 1000; // Throttle cleanups to once per second
    this.inCleanupProcess = false; // Flag to prevent recursive cleanups
    this.isFullscreenActive = false; // Add flag to track fullscreen state
  }

  setupCleanupHooks() {
    if (typeof window === 'undefined') return;
    
    // Track scrolling state to prevent cleanup during scroll with improved debounce
    window.addEventListener('scroll', () => {
      // Don't register scrolling events when in fullscreen mode
      if (this.isFullscreenActive) {
        console.log('Ignoring scroll event during fullscreen mode');
        return;
      }
      
      this.isScrolling = true;
      
      // Clear any existing timeout
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      
      // Reset scrolling flag after a longer delay
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
      }, 250); // Increased from 150ms to 250ms for better detection
    }, { passive: true });
    
    // Add a mutation observer to detect fullscreen mode changes
    this.setupFullscreenObserver();
    
    // Use the navigation API if available, but be more selective
    if ('navigation' in window) {
      // @ts-ignore - TypeScript might not recognize the Navigation API
      window.navigation.addEventListener('navigate', (event) => {
        // Only clean up for actual navigation to new pages, not for scroll or in-page transitions
        if (this.isScrolling || this.inCleanupProcess) {
          console.log('Ignoring navigation event during scrolling or cleanup');
          return;
        }
        
        // Check if this is a real navigation (different URL)
        const currentPath = window.location.pathname;
        const targetPath = new URL(event.destination.url).pathname;
        
        if (currentPath !== targetPath) {
          console.log(`Navigation detected from ${currentPath} to ${targetPath}, cleaning up maps`);
          this.safeCleanupAll();
        } else {
          console.log('Same-page navigation detected, skipping cleanup');
        }
      });
    }
    
    // For regular page unload events, always clean up
    window.addEventListener('beforeunload', () => {
      // Only clean up if not in fullscreen mode
      if (this.isFullscreenActive) {
        console.log('Page unloading during fullscreen, deferring cleanup');
        return;
      }
      console.log('Page unloading, cleaning up maps');
      this.safeCleanupAll();
    });
    
    // Add Astro-specific navigation hooks if using Astro, but be more selective
    document.addEventListener('astro:before-swap', () => {
      // Don't clean up during fullscreen mode
      if (this.isFullscreenActive) {
        console.log('Ignoring astro:before-swap event during fullscreen');
        return;
      }
      
      if (this.isScrolling || this.inCleanupProcess) {
        console.log('Ignoring astro:before-swap event during scrolling or cleanup');
        return;
      }
      
      // Throttle cleanup calls
      if (this.shouldThrottleCleanup()) {
        console.log('Throttling map cleanup to prevent multiple rapid cleanups');
        return;
      }
      
      console.log('Astro navigation: cleaning up maps');
      this.safeCleanupAll();
    });
    
    // For view transitions, just prepare the maps, don't clean them up yet
    document.addEventListener('viewtransitionstart', () => {
      if (this.isScrolling || this.inCleanupProcess) {
        console.log('Ignoring view transition event during scrolling or cleanup');
        return;
      }
      console.log('View transition starting: preparing maps');
      this.prepareForTransition();
    });
  }

  // Add a new method to detect fullscreen mode
  setupFullscreenObserver() {
    // Use MutationObserver to detect when fullscreen mode is activated/deactivated
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const body = document.body;
            if (body.classList.contains('fullscreen-active')) {
              this.isFullscreenActive = true;
              console.log('Fullscreen mode detected, pausing map cleanup');
            } else if (this.isFullscreenActive) {
              this.isFullscreenActive = false;
              console.log('Fullscreen mode exited, resuming normal operation');
              // Add a delay before re-enabling cleanup to prevent flicker
              setTimeout(() => {
                this.isFullscreenActive = false;
              }, 500);
            }
          }
        }
      });
      
      // Start observing the body element for class changes
      if (typeof document !== 'undefined') {
        observer.observe(document.body, { attributes: true });
      }
    }
  }

  // Add throttling check to prevent rapid multiple cleanups
  shouldThrottleCleanup() {
    const now = Date.now();
    if (now - this.lastCleanupTime < this.cleanupThrottleTime) {
      return true;
    }
    this.lastCleanupTime = now;
    return false;
  }

  registerMap(id, mapInstance) {
    if (this.destroyedMaps.has(id)) {
      this.destroyedMaps.delete(id); // Reset destroyed status if re-registering
    }
    this.maps.set(id, mapInstance);
    console.log(`Registered map: ${id}`);
    return this;
  }

  registerOverlay(id, overlay) {
    this.overlays.set(id, overlay);
    console.log(`Registered overlay: ${id}`);
    return this;
  }

  prepareForTransition() {
    // Hide all map tooltips during transitions
    document.querySelectorAll('.map-tooltip').forEach(tooltip => {
      if (tooltip instanceof HTMLElement) {
        tooltip.style.display = 'none';
      }
    });
  }

  // Wrapper for cleanupAll that prevents reentrant issues
  safeCleanupAll() {
    // Don't clean up during scrolling, cleanup process, or fullscreen mode
    if (this.isScrolling) {
      console.log('Ignoring cleanup request during scrolling');
      return false;
    }

    if (this.inCleanupProcess) {
      console.log('Already in cleanup process, ignoring duplicate request');
      return false;
    }
    
    if (this.isFullscreenActive) {
      console.log('Ignoring cleanup request during fullscreen mode');
      return false;
    }
    
    try {
      this.inCleanupProcess = true;
      const result = this.cleanupAll();
      return result;
    } catch (error) {
      console.error('Error in safeCleanupAll:', error);
      return false;
    } finally {
      this.inCleanupProcess = false;
    }
  }

  cleanupMap(id) {
    try {
      // Skip if map was already destroyed
      if (this.destroyedMaps.has(id)) {
        console.log(`Map ${id} was already cleaned up, skipping`);
        return true;
      }

      const map = this.maps.get(id);
      const overlay = this.overlays.get(id);
      
      if (!map) {
        console.log(`No map found with ID: ${id}`);
        return false;
      }
      
      console.log(`Cleaning up map: ${id}`);
      
      // Safety check - verify the map instance is valid
      if (!map._container || !map.style) {
        console.warn(`Map ${id} appears to be in an invalid state, marking as destroyed`);
        this.destroyedMaps.add(id);
        this.maps.delete(id);
        this.overlays.delete(id);
        return true;
      }
      
      // Remove the overlay first
      if (overlay) {
        try {
          // Check if the overlay is still a control on the map
          if (map._controls && map._controls.includes(overlay)) {
            map.removeControl(overlay);
            console.log(`Removed overlay from map: ${id}`);
          }
        } catch (e) {
          console.warn(`Failed to remove overlay from map ${id}:`, e);
        }
        this.overlays.delete(id);
      }
      
      // Remove event listeners
      try {
        map.off();
      } catch (e) {
        console.warn(`Failed to remove map event listeners for ${id}:`, e);
      }
      
      // Check if the map container still exists
      const mapContainer = document.getElementById(`map-container-${id}`);
      const mapElement = document.getElementById(`maplibre-map-${id}`);
      
      if (!mapContainer) {
        console.log(`Map container for ${id} not found, skipping remove()`);
      } else {
        // More careful removal of map instance
        try {
          // First detach the map from its container so React can handle the DOM
          const originalContainer = map.getContainer();
          
          // Only remove if the map's canvas is still connected to the DOM
          if (map._canvas && map._canvas.parentNode) {
            map.remove();
            console.log(`Map ${id} removed`);
          } else {
            // Map is partially destroyed, just clean up our references
            console.warn(`Map ${id} has invalid internal state, cleaning up references only`);
          }
        } catch (e) {
          console.warn(`Failed to call remove() on map ${id}:`, e);
        }
      }
      
      // Mark as destroyed to prevent double-cleanup
      this.destroyedMaps.add(id);
      this.maps.delete(id);
      
      return true;
    } catch (e) {
      console.error(`Error cleaning up map ${id}:`, e);
      
      // Even on error, mark it as destroyed to prevent retry
      this.destroyedMaps.add(id);
      this.maps.delete(id);
      this.overlays.delete(id);
      
      return false;
    }
  }

  cleanupAll() {
    let success = true;
    
    // Create a copy of the keys to avoid iterator invalidation
    const mapIds = Array.from(this.maps.keys());
    
    for (const id of mapIds) {
      const result = this.cleanupMap(id);
      success = success && result;
    }
    
    return success;
  }
}

// Create a singleton instance
const mapCleanupManager = new MapCleanupManager();

// Export the singleton
export default mapCleanupManager;
