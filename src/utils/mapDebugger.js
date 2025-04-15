/**
 * Map debugging utility to help diagnose rendering issues
 */

const mapDebugger = {
  init() {
    if (typeof window === 'undefined') return;
    
    // Add to window for console access
    window.mapDebugger = this;
    
    console.log('[MapDebugger] Initialized');
  },
  
  checkMapStatus(mapId = 'home-page-map') {
    if (typeof document === 'undefined') return null;
    
    const mapContainerId = `map-container-${mapId}`;
    const mapLibreId = `maplibre-map-${mapId}`;
    
    const container = document.getElementById(mapContainerId);
    const mapElement = document.getElementById(mapLibreId);
    
    const status = {
      container: {
        exists: !!container,
        dimensions: container ? {
          width: container.clientWidth,
          height: container.clientHeight,
          display: getComputedStyle(container).display,
          visibility: getComputedStyle(container).visibility,
          position: getComputedStyle(container).position,
          zIndex: getComputedStyle(container).zIndex,
        } : null
      },
      map: {
        exists: !!mapElement,
        dimensions: mapElement ? {
          width: mapElement.clientWidth,
          height: mapElement.clientHeight,
          display: getComputedStyle(mapElement).display,
          visibility: getComputedStyle(mapElement).visibility
        } : null
      },
      canvasElements: mapElement ? mapElement.querySelectorAll('canvas').length : 0,
      tooltip: {
        exists: !!document.getElementById(`deck-tooltip-${mapId}`)
      }
    };
    
    console.log(`[MapDebugger] Status for ${mapId}:`, status);
    return status;
  },
  
  fixMapVisibility(mapId = 'home-page-map') {
    if (typeof document === 'undefined') return false;
    
    const mapContainerId = `map-container-${mapId}`;
    const mapLibreId = `maplibre-map-${mapId}`;
    
    const container = document.getElementById(mapContainerId);
    const mapElement = document.getElementById(mapLibreId);
    
    console.log(`[MapDebugger] Attempting to fix map ${mapId}`);
    
    let fixed = false;
    
    if (container) {
      container.style.position = 'relative';
      container.style.zIndex = '10';
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.minHeight = '300px';
      fixed = true;
    }
    
    if (mapElement) {
      mapElement.style.display = 'block';
      mapElement.style.visibility = 'visible';
      mapElement.style.position = 'absolute';
      mapElement.style.top = '0';
      mapElement.style.left = '0';
      mapElement.style.width = '100%';
      mapElement.style.height = '100%';
      mapElement.style.zIndex = '5';
      fixed = true;
    }
    
    console.log(`[MapDebugger] Fix attempted: ${fixed ? 'changes applied' : 'no elements found'}`);
    return fixed;
  }
};

// Initialize if in browser
if (typeof window !== 'undefined') {
  // Wait for document to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mapDebugger.init());
  } else {
    mapDebugger.init();
  }
}

export default mapDebugger;
