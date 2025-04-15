import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

// Define the type for our map context
interface MapContextType {
  mapInstance: any | null;
  setMapInstance: (map: any) => void;
  mapInitialized: boolean;
  setMapInitialized: (initialized: boolean) => void;
  geojsonData: any | null;
  setGeojsonData: (data: any) => void;
  deckOverlay: any | null;
  setDeckOverlay: (overlay: any) => void;
  tooltipRef: React.RefObject<HTMLDivElement>;
  registerTooltip: (mapId: string, tooltipElement: HTMLDivElement | null) => void;
  getTooltip: (mapId: string) => HTMLDivElement | null;
}

// Create a global state object outside of React to maintain state between component instances
const globalMapState = {
  mapInstance: null,
  mapInitialized: false,
  geojsonData: null,
  deckOverlay: null,
  tooltipElement: null,
  // Add a collection to track tooltips by mapId
  tooltips: {} as Record<string, HTMLDivElement | null>
};

// Create the context
const MapContext = createContext<MapContextType>({
  mapInstance: null,
  setMapInstance: () => {},
  mapInitialized: false,
  setMapInitialized: () => {},
  geojsonData: null,
  setGeojsonData: () => {},
  deckOverlay: null,
  setDeckOverlay: () => {},
  tooltipRef: { current: null },
  registerTooltip: () => {},
  getTooltip: () => null
});

// Provider component
export const MapProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Create state setters that also update the global object
  const [mapInstance, setMapInstanceState] = useState<any>(globalMapState.mapInstance);
  const [mapInitialized, setMapInitializedState] = useState<boolean>(globalMapState.mapInitialized);
  const [geojsonData, setGeojsonDataState] = useState<any>(globalMapState.geojsonData);
  const [deckOverlay, setDeckOverlayState] = useState<any>(globalMapState.deckOverlay);
  const tooltipRef = useRef<HTMLDivElement>(globalMapState.tooltipElement);

  // Create setter functions that update both React state and global state
  const setMapInstance = (map: any) => {
    globalMapState.mapInstance = map;
    setMapInstanceState(map);
  };
  
  const setMapInitialized = (initialized: boolean) => {
    globalMapState.mapInitialized = initialized;
    setMapInitializedState(initialized);
  };
  
  const setGeojsonData = (data: any) => {
    globalMapState.geojsonData = data;
    setGeojsonDataState(data);
    
    // Cache valid geojson data to sessionStorage
    if (data && Array.isArray(data.features) && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('bid-geojson-data', JSON.stringify(data));
      } catch (e) {
        console.warn('Error caching GeoJSON data:', e);
      }
    }
  };
  
  const setDeckOverlay = (overlay: any) => {
    globalMapState.deckOverlay = overlay;
    setDeckOverlayState(overlay);
  };

  // Method to register tooltips by mapId
  const registerTooltip = (mapId: string, tooltipElement: HTMLDivElement | null) => {
    if (mapId) {
      console.log(`Registering tooltip for map: ${mapId}`); // Debug log
      
      globalMapState.tooltips[mapId] = tooltipElement;
      if (mapId === 'default-map') {
        globalMapState.tooltipElement = tooltipElement;
        tooltipRef.current = tooltipElement;
      }
      
      // Store tooltip reference in window for debugging
      if (typeof window !== 'undefined') {
        if (!window.mapTooltips) window.mapTooltips = {};
        window.mapTooltips[mapId] = tooltipElement;
        
        // Add direct DOM access method for emergencies
        if (!window.getMapTooltip) {
          window.getMapTooltip = (id) => {
            const tooltipId = `deck-tooltip-${id}`;
            return document.getElementById(tooltipId);
          };
        }
      }
    }
  };

  // Method to get tooltip by mapId with improved reliability
  const getTooltip = (mapId: string): HTMLDivElement | null => {
    // First check if we're still in the DOM context where tooltips exist
    if (typeof document !== 'undefined') {
      // Check if the map container still exists - if not, don't try to access tooltip
      const mapContainer = document.getElementById(`map-container-${mapId}`);
      if (!mapContainer) {
        // Map container no longer exists, likely navigated away from the page
        console.log(`Map container for ${mapId} no longer exists, skipping tooltip retrieval`);
        return null;
      }
      
      // Try to get directly from DOM which is most reliable
      const tooltipId = `deck-tooltip-${mapId}`;
      const domTooltip = document.getElementById(tooltipId) as HTMLDivElement;
      if (domTooltip) {
        return domTooltip;
      }
    }
    
    // Next try from our tracked tooltips
    const trackedTooltip = globalMapState.tooltips[mapId];
    if (trackedTooltip) {
      return trackedTooltip;
    }
    
    // Fall back to default tooltip
    if (globalMapState.tooltipElement) {
      return globalMapState.tooltipElement;
    }
    
    // Only log warning if in browser context
    if (typeof window !== 'undefined') {
      console.warn(`No tooltip found for map: ${mapId}`);
    }
    return null;
  };

  // Make sure to expose the MapContext globally for direct access in emergencies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.BIDMapContext = {
        getTooltip,
        registerTooltip
      };
    }
  }, []);

  // Enhanced initialization to improve state persistence
  useEffect(() => {
    // If we already have a stored state, use it
    if (!globalMapState.geojsonData && typeof window !== 'undefined') {
      // Try to get cached geojson data to prevent repeated fetches
      try {
        const cachedData = sessionStorage.getItem('bid-geojson-data');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData && Array.isArray(parsedData.features)) {
            console.log('Using cached GeoJSON data');
            globalMapState.geojsonData = parsedData;
            setGeojsonDataState(parsedData);
          }
        }
      } catch (e) {
        console.warn('Error retrieving cached GeoJSON:', e);
      }
    }
  }, []);

  return (
    <MapContext.Provider 
      value={{
        mapInstance,
        setMapInstance,
        mapInitialized,
        setMapInitialized,
        geojsonData,
        setGeojsonData,
        deckOverlay,
        setDeckOverlay,
        tooltipRef,
        registerTooltip,
        getTooltip
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

// Hook for easy context consumption
export const useMapContext = () => useContext(MapContext);

export default MapContext;
