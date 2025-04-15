import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';
import { MapProvider, useMapContext } from './MapContext';
import mapCleanupManager from '../../utils/mapCleanup';
// Import utility functions from mapUtils.js
import { createBidPerimeters, createBidPolygons, calculateBoundingBox, getBasePath } from '../../utils/mapUtils';

interface MapVisualizerProps {
  projectBids: string[];
  focusBid?: string | null;
  height?: string;
  initialZoom?: number;
  mapId?: string;
  bidToSlugMap?: Record<string, string>;
}

// Main exported component with unified structure
export default function MapVisualizer({ 
  projectBids = [], 
  focusBid = null, 
  height = '500px',
  initialZoom = 14,
  mapId = 'default-map',
  bidToSlugMap = {}
}: MapVisualizerProps) {
  // Use ref instead of state for zoom level to prevent re-renders
  const zoomLevelRef = useRef(initialZoom);
  
  const handleZoom = (newZoom: number) => {
    // Update the ref without triggering a re-render
    zoomLevelRef.current = newZoom;
  };

  // Generate unique container IDs based on mapId
  const mapContainerId = `map-container-${mapId}`;
  const mapLibreId = `maplibre-map-${mapId}`;
  const tooltipId = `deck-tooltip-${mapId}`;

  // Use different height for home page map
  const mapHeight = mapId === 'home-page-map' ? '55vh' : height;

  return (
    <MapProvider>
      <div className="relative">
        <div 
          id={mapContainerId} 
          className="w-full bg-card rounded-lg border relative"
          style={{ height: mapHeight }}
        ></div>
        {/* Restore the caption text - make it shorter for the home page */}
        <p className={`text-center text-sm text-muted-foreground ${mapId === 'home-page-map' ? 'mt-2' : 'mt-4'}`}>
          Interactive map of NYC Business Improvement Districts
          {focusBid && <span className="font-medium"> • Focused on: {focusBid}</span>}
        </p>
        <DeckGLMap 
          projectBids={projectBids} 
          focusBid={focusBid} 
          initialZoom={initialZoom}
          onZoomChange={handleZoom}
          mapId={mapId}
          mapContainerId={mapContainerId}
          mapLibreId={mapLibreId}
          tooltipId={tooltipId}
          bidToSlugMap={bidToSlugMap}
        />
      </div>
    </MapProvider>
  );
}

// Updated DeckGLMapProps with container IDs
interface DeckGLMapProps {
  projectBids: string[];
  focusBid?: string | null;
  initialZoom: number;
  onZoomChange: (zoom: number) => void;
  mapId: string;
  mapContainerId: string;
  mapLibreId: string;
  tooltipId: string;
  bidToSlugMap: Record<string, string>;
}

function DeckGLMap({ 
  projectBids, 
  focusBid, 
  initialZoom, 
  onZoomChange,
  mapId,
  mapContainerId,
  mapLibreId,
  tooltipId,
  bidToSlugMap
}: DeckGLMapProps) {
  // Only execute client-side
  if (typeof window === 'undefined') return null;
  
  // Get map context for shared state
  const { 
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
  } = useMapContext();

  // Reference to track if this component is mounted
  const isMounted = useRef(true);
  
  // Flag to track if the map is currently zooming
  const isZooming = useRef(false);
  
  // Store instance-specific data in refs
  const currentMapRef = useRef(null);
  const currentOverlayRef = useRef(null);

  // Set up cleanup on unmount
  useEffect(() => {
    // Add these functions to window so they're accessible from the map setup
    window.mapFunctions = window.mapFunctions || {};
    window.mapFunctions[mapId] = {};

    // Create a more reliable BID navigation handler
    const handleBidNavigation = (e: CustomEvent) => {
      try {
        if (!e.detail) return;
        
        const { mapId: eventMapId, bidName } = e.detail;
        if (eventMapId !== mapId || !bidName || !currentMapRef.current) return;
        
        console.log(`Navigation requested to BID: ${bidName} on map: ${mapId}`);
        
        // If we don't have geojsonData yet, try to get it
        if (!geojsonData && typeof window !== 'undefined') {
          console.log('GeoJSON data not loaded yet, attempting to load');
          
          const base = getBasePath();
          fetch(`${base}/data/bids.geojson`)
            .then(response => {
              if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
              return response.json();
            })
            .then(data => {
              setGeojsonData(data);
              navigateToBid(data, bidName);
            })
            .catch(error => console.error('Error loading BID data:', error));
        } else {
          navigateToBid(geojsonData, bidName);
        }
      } catch (error) {
        console.error('Error handling BID navigation:', error);
      }
    };
    
    // Helper function to navigate to a BID
    const navigateToBid = (data: any, bidName: string) => {
      if (!data || !bidName || !currentMapRef.current) return;
      
      const bidFeature = data.features.find(
        feature => feature.properties?.F_ALL_BI_2 === bidName
      );
      
      if (bidFeature && bidFeature.geometry) {
        const bbox = calculateBoundingBox(bidFeature);
        
        // Animate to this BID
        currentMapRef.current.flyTo({
          center: [
            (bbox.minLng + bbox.maxLng) / 2,
            (bbox.minLat + bbox.maxLat) / 2
          ],
          zoom: 14,
          duration: 1200,
          essential: true
        });
      }
    };
    
    // Ensure we're using the right event name and properly cleaning up
    window.removeEventListener('map-navigate-to-bid', handleBidNavigation as EventListener);
    window.addEventListener('map-navigate-to-bid', handleBidNavigation as EventListener);
    console.log(`Added 'map-navigate-to-bid' listener for map: ${mapId}`);

    return () => {
      // Clean up our global references too
      if (window.mapFunctions && window.mapFunctions[mapId]) {
        delete window.mapFunctions[mapId];
      }
      
      window.removeEventListener('map-navigate-to-bid', handleBidNavigation as EventListener);
      console.log(`Removed 'map-navigate-to-bid' listener for map: ${mapId}`);
    };
  }, [mapId, tooltipId, projectBids]);

  // Register with cleanup manager
  useEffect(() => {
    return () => {
      // On unmount, trigger cleanup through the manager
      if (currentMapRef.current) {
        mapCleanupManager.registerMap(mapId, currentMapRef.current);
      }
      if (currentOverlayRef.current) {
        mapCleanupManager.registerOverlay(mapId, currentOverlayRef.current);
      }
    };
  }, [mapId]);

  useEffect(() => {
    const loadDeckGL = async () => {
      try {
        const { GeoJsonLayer } = await import('@deck.gl/layers');
        const { MapboxOverlay } = await import('@deck.gl/mapbox');
        const { default: maplibregl } = await import('maplibre-gl');
        
        if (!isMounted.current) return;
        
        const mapContainer = document.getElementById(mapContainerId);
        if (!mapContainer) {
          console.error(`Map container not found: ${mapContainerId}`);
          return;
        }

        // Check for existing stored map state
        let savedState = null;
        try {
          const savedMapKey = `map-state-${mapId}`;
          if (typeof sessionStorage !== 'undefined') {
            const storedState = sessionStorage.getItem(savedMapKey);
            if (storedState) {
              savedState = JSON.parse(storedState);
              console.log(`Restored map state for ${mapId}`, savedState);
            }
          }
        } catch (e) {
          console.warn('Error accessing sessionStorage:', e);
        }

        let tooltip = document.getElementById(tooltipId);
        if (!tooltip) {
          tooltip = document.createElement('div');
          tooltip.id = tooltipId;
          tooltip.style.display = 'none';
          tooltip.style.position = 'absolute';
          tooltip.style.zIndex = '1000';
          tooltip.style.pointerEvents = 'none';
          mapContainer.appendChild(tooltip);
          
          // Register tooltip with MapContext
          registerTooltip(mapId, tooltip);
          
          if (tooltipRef && !tooltipRef.current) {
            tooltipRef.current = tooltip;
          }
          
          // Add a debug class to help identify tooltip elements
          tooltip.classList.add('map-tooltip');
          tooltip.setAttribute('data-map-id', mapId);
        }

        // Use saved state or default viewState
        let viewState = savedState?.viewState || {
          latitude: 40.7128,
          longitude: -74.0060,
          zoom: initialZoom,
          pitch: 0,
          bearing: 0
        };
        
        let bidData = geojsonData;
        if (!bidData) {
          const base = getBasePath();
          const response = await fetch(`${base}/data/bids.geojson`);
          if (!response.ok) {
            throw new Error(`Failed to fetch GeoJSON: ${response.status} ${response.statusText}`);
          }
          bidData = await response.json();
          setGeojsonData(bidData);
        }

        if (focusBid && bidData) {
          const focusFeature = bidData.features.find(
            feature => feature.properties?.F_ALL_BI_2 === focusBid
          );
          
          if (focusFeature && focusFeature.geometry) {
            if (focusFeature.geometry.type === 'Polygon' || focusFeature.geometry.type === 'MultiPolygon') {
              const bbox = calculateBoundingBox(focusFeature);
              viewState = {
                ...viewState,
                latitude: (bbox.maxLat + bbox.minLat) / 2,
                longitude: (bbox.maxLng + bbox.minLng) / 2,
                zoom: initialZoom
              };
            }
          }
        }

        let map = currentMapRef.current;
        
        if (!map) {
          while (mapContainer.firstChild) {
            mapContainer.removeChild(mapContainer.firstChild);
          }
          
          const mapRoot = document.createElement('div');
          mapRoot.id = mapLibreId;
          mapRoot.style.width = '100%';
          mapRoot.style.height = '100%';
          mapRoot.style.borderRadius = '0.5rem';
          mapContainer.appendChild(mapRoot);
          
          mapContainer.appendChild(tooltip);
          
          map = new maplibregl.Map({
            container: mapLibreId,
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            center: [viewState.longitude, viewState.latitude],
            zoom: viewState.zoom,
            bearing: viewState.bearing,
            pitch: viewState.pitch,
            minZoom: 9,
            renderWorldCopies: false,
            fadeDuration: 0
          });
          
          currentMapRef.current = map;
          if (mapId === 'default-map') {
            setMapInstance(map);
          }
          
          // Register with cleanup manager immediately after creation
          mapCleanupManager.registerMap(mapId, map);
          
          map.on('movestart', () => {
            isZooming.current = true;
            if (tooltip) tooltip.style.display = 'none';
          });
          
          map.on('moveend', () => {
            isZooming.current = false;
            if (map) {
              const currentZoom = map.getZoom();
              onZoomChange(currentZoom);
              
              // Save current state to sessionStorage
              try {
                if (typeof sessionStorage !== 'undefined') {
                  const center = map.getCenter();
                  const state = {
                    viewState: {
                      latitude: center.lat,
                      longitude: center.lng,
                      zoom: currentZoom,
                      pitch: map.getPitch(),
                      bearing: map.getBearing()
                    },
                    timestamp: Date.now()
                  };
                  sessionStorage.setItem(`map-state-${mapId}`, JSON.stringify(state));
                }
              } catch (e) {
                console.warn('Error saving map state:', e);
              }
            }
          });
          
          const handleExternalZoom = (e: CustomEvent) => {
            if (e.detail?.mapId === mapId && e.detail?.zoom && map) {
              map.flyTo({
                center: [viewState.longitude, viewState.latitude],
                zoom: e.detail.zoom,
                duration: 1500
              });
            }
          };
          
          window.addEventListener('map-zoom-request', handleExternalZoom as EventListener);
          
          map.on('style.load', () => {
            if (!bidData) return;
            
            if (mapId === 'default-map') {
              setMapInitialized(true);
            }
            
            setupMapLayers(
              map, 
              bidData, 
              projectBids, 
              focusBid, 
              MapboxOverlay, 
              GeoJsonLayer, 
              tooltip,
              (overlay) => {
                currentOverlayRef.current = overlay;
                if (mapId === 'default-map') {
                  setDeckOverlay(overlay);
                }
              },
              mapId,
              tooltipId,
              bidToSlugMap
            );

            // After overlay is created, register it with cleanup manager
            if (currentOverlayRef.current) {
              mapCleanupManager.registerOverlay(mapId, currentOverlayRef.current);
            }
          });
        } else {
          if (map.loaded()) {
            map.flyTo({
              center: [viewState.longitude, viewState.latitude],
              zoom: map.getZoom(),
              duration: 1000
            });
            
            if (currentOverlayRef.current && bidData) {
              const { GeoJsonLayer } = await import('@deck.gl/layers');
              updateMapLayers(
                currentOverlayRef.current, 
                bidData, 
                projectBids, 
                focusBid, 
                GeoJsonLayer, 
                tooltip,
                mapId,
                tooltipId,
                bidToSlugMap
              );
            }
          }
        }
      } catch (error) {
        console.error("Error initializing Deck.gl map:", error);
      }
    };
    
    loadDeckGL();
    
    // Clean up on unmount with improved layer removal
    return () => {
      // Ensure we clean up map resources properly
      if (currentMapRef.current) {
        try {
          // Remove any deck.gl overlays
          if (currentOverlayRef.current) {
            try {
              currentMapRef.current.removeControl(currentOverlayRef.current);
            } catch (e) {
              console.warn(`Error removing deck overlay for map ${mapId}:`, e);
            }
            currentOverlayRef.current = null;
          }
          
          // If it's our map, remove event listeners and clean up
          const map = currentMapRef.current;
          
          // Remove map controls and event listeners
          map.off();
          
          // If we navigated away and want to preserve state, don't remove
          // Otherwise clear references
          if (document.getElementById(mapContainerId)) {
            map.remove();
          }
          
          currentMapRef.current = null;
        } catch (e) {
          console.warn(`Error cleaning up map ${mapId}:`, e);
        }
      }
    };
  }, [projectBids, focusBid, mapContainerId, mapLibreId, tooltipId, mapId]);
  
  return null;
}

// Update setupMapLayers function to handle layer creation more safely
async function setupMapLayers(
  map, 
  geojsonData, 
  projectBids, 
  focusBid, 
  MapboxOverlay, 
  GeoJsonLayer, 
  tooltip, 
  setDeckOverlay, 
  mapId,
  tooltipId,
  bidToSlugMap
) {
  try {
    if (!map || !geojsonData) {
      console.error("Missing required parameters for setupMapLayers");
      return;
    }
    
    // Check if the map container still exists - if not, abort
    if (typeof document !== 'undefined') {
      const mapContainer = document.getElementById(`map-container-${mapId}`);
      if (!mapContainer) {
        console.log(`Map container for ${mapId} no longer exists, aborting layer setup`);
        return;
      }
    }
    
    const mapStyle = map.getStyle();
    if (!mapStyle || !mapStyle.layers) {
      console.error("Map style or layers not available");
      return;
    }
    
    const firstLabelLayer = mapStyle.layers.find(layer => 
      layer && (layer.type === 'symbol' || (layer.id && (layer.id.includes('label') || layer.id.includes('place'))))
    );
    
    const firstLabelLayerId = firstLabelLayer?.id;
    
    // Add safety check for geojsonData processing
    if (!Array.isArray(geojsonData.features)) {
      console.error("Invalid geojsonData structure - features array missing");
      return;
    }

    // Process BID geometries with error handling
    let bidPerimeters, bidPolygons;
    try {
      bidPerimeters = createBidPerimeters(geojsonData);
      bidPolygons = createBidPolygons(geojsonData);
    } catch (error) {
      console.error("Error processing BID geometries:", error);
      // Provide fallback empty arrays to prevent rendering errors
      bidPerimeters = [];
      bidPolygons = [];
    }

    // Double-check results
    if (!bidPerimeters || !bidPolygons || bidPerimeters.length === 0 || bidPolygons.length === 0) {
      console.warn("Failed to process BID geometries or empty results");
      // Still continue but with empty arrays
      bidPerimeters = bidPerimeters || [];
      bidPolygons = bidPolygons || [];
    }

    // Create a unique ID prefix to prevent layer ID conflicts
    const layerIdPrefix = `${mapId}-${Date.now()}-`;

    // Create layers with safety checks
    const layers = [];
    
    // Only add layers if there's valid data
    if (geojsonData.features.length > 0) {
      layers.push(
        new GeoJsonLayer({
          id: `${layerIdPrefix}bid-layer`,
          data: geojsonData,
          pickable: false,
          stroked: true,
          filled: true,
          extruded: false,
          beforeId: firstLabelLayerId,
          getFillColor: d => {
            const bidName = d.properties?.F_ALL_BI_2;
            const hasProject = bidName && projectBids.includes(bidName);
            const isFocused = bidName && focusBid === bidName;
            
            if (isFocused) return [5, 150, 105, 180]; 
            if (hasProject) return [16, 185, 129, 150]; 
            return [59, 130, 246, 150]; 
          },
          getLineColor: [0, 0, 0, 0],
          getLineWidth: 0,
          parameters: {
            depthTest: false,
            zIndex: 1
          },
          updateTriggers: {
            getFillColor: [projectBids.join(','), focusBid]
          }
        })
      );
    }

    // Only add perimeter layer if there's valid data
    if (bidPerimeters.length > 0) {
      layers.push(
        new GeoJsonLayer({
          id: `${layerIdPrefix}bid-perimeter-layer`,
          data: bidPerimeters,
          pickable: false,
          stroked: false,
          filled: false,
          lineWidthUnits: 'pixels',
          getLineColor: d => {
            const bidName = d.properties?.bidName;
            const hasProject = bidName && projectBids.includes(bidName);
            const isFocused = bidName && focusBid === bidName;
            
            if (isFocused) return [4, 120, 87, 255]; 
            if (hasProject) return [16, 185, 129, 255];
            return [30, 64, 175, 255]; 
          },
          getLineWidth: d => {
            const bidName = d.properties?.bidName;
            const hasProject = bidName && projectBids.includes(bidName);
            const isFocused = bidName && focusBid === bidName;
            
            if (isFocused) return 4;
            if (hasProject) return 3;
            return 2;
          },
          parameters: {
            depthTest: false,
            zIndex: 2
          },
          updateTriggers: {
            getLineColor: [projectBids.join(','), focusBid],
            getLineWidth: [projectBids.join(','), focusBid]
          }
        })
      );
    }

    // Only add interaction layer if there's valid data
    if (bidPolygons.length > 0) {
      layers.push(
        new GeoJsonLayer({
          id: `${layerIdPrefix}bid-interaction-layer`,
          data: bidPolygons,
          pickable: true,
          stroked: false,
          filled: true,
          getFillColor: [0, 0, 0, 0],
          parameters: {
            depthTest: false,
            zIndex: 3
          }
        })
      );
    }
    
    // Check if we have any layers to render
    if (layers.length === 0) {
      console.warn("No valid layers to render");
      return;
    }
  
    // When creating the overlay, add error boundaries
    const deckOverlay = new MapboxOverlay({
      interleaved: true,
      layers,
      onError: (error) => {
        console.error(`Deck.gl error in map ${mapId}:`, error);
      },
      onClick: (info) => {
        // Handle clicks on BID geometries
        if (!info || !info.object) return;
        
        const bidName = info.object.properties?.bidName;
        if (!bidName) return;
        
        const hasProject = projectBids.includes(bidName);
        
        // Only navigate if this BID has a project
        if (hasProject && bidToSlugMap && bidToSlugMap[bidName]) {
          const projectSlug = bidToSlugMap[bidName];
          const baseUrl = getBasePath();
          window.location.href = `${baseUrl}/projects/${projectSlug}`;
        }
      },
      onHover: (info) => {
        // Safety check if tooltip still exists
        if (!document.getElementById(tooltipId)) {
          return;
        }
        
        // Only show tooltips when valid hover data exists
        if (!info || !info.object || !tooltip) {
          if (tooltip) tooltip.style.display = 'none';
          return;
        }
        
        const bidName = info.object.properties?.bidName;
        if (!bidName) {
          tooltip.style.display = 'none';
          return;
        }
        
        const hasProject = projectBids.includes(bidName);
        
        tooltip.style.display = 'block';
        tooltip.style.left = `${info.x}px`;
        tooltip.style.top = `${info.y}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
        tooltip.style.marginTop = '-20px';
        tooltip.style.opacity = '1';
        tooltip.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        
        tooltip.innerHTML = `
          <div class="tooltip-content" style="font-family: system-ui, sans-serif; padding: 8px; background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <strong>${bidName}</strong>
            ${hasProject ? 
              `<p style="color: #10B981; margin-top: 4px; margin-bottom: 0;">
                Has project analysis
                ${bidToSlugMap && bidToSlugMap[bidName] ? 
                  `<span style="font-size: 12px; margin-left: 4px;">(click to view)</span>` : 
                  ''}
              </p>` : 
              '<p style="color: #6B7280; margin-top: 4px; margin-bottom: 0;">No analysis yet</p>'}
          </div>
        `;
      },
      onMouseLeave: () => {
        // Safety check if tooltip still exists
        const tooltipElement = document.getElementById(tooltipId);
        if (!tooltipElement) return;
        
        if (tooltip) tooltip.style.display = 'none';
      }
    });
    
    // Store the overlay reference with a timestamp to track freshness
    setDeckOverlay(deckOverlay);
    deckOverlay._createdAt = Date.now();
    deckOverlay._mapId = mapId;
    
    // Add the overlay to the map with improved error handling
    try {
      // Check again if the map element still exists before adding controls
      if (typeof document !== 'undefined') {
        const mapElement = document.getElementById(`maplibre-map-${mapId}`);
        if (!mapElement) {
          console.warn(`Map element ${mapId} no longer exists, skipping overlay`);
          return;
        }
      }
      
      map.addControl(deckOverlay);
      console.log(`Created ${layers.length} layers for map ${mapId}`);
    } catch (error) {
      console.error("Error adding deck overlay to map:", error);
    }
  } catch (error) {
    console.error("Error setting up map layers:", error);
  }
}

// Update updateMapLayers function with similar improvements
function updateMapLayers(
  deckOverlay, 
  geojsonData, 
  projectBids, 
  focusBid, 
  GeoJsonLayer, 
  tooltip, 
  mapId,
  tooltipId,
  bidToSlugMap
) {
  try {
    // Check if the map still exists in DOM
    if (typeof document !== 'undefined') {
      const mapContainer = document.getElementById(`map-container-${mapId}`);
      if (!mapContainer) {
        console.log(`Map container for ${mapId} no longer exists, aborting update`);
        return;
      }
    }
    
    // Validate core requirements
    if (!deckOverlay || !geojsonData || !Array.isArray(geojsonData.features)) {
      console.error("Invalid params for updateMapLayers");
      return;
    }
    
    // Process geometries with error handling
    let bidPerimeters, bidPolygons;
    try {
      bidPerimeters = createBidPerimeters(geojsonData);
      bidPolygons = createBidPolygons(geojsonData);
    } catch (error) {
      console.error("Error processing BID geometries for update:", error);
      bidPerimeters = [];
      bidPolygons = [];
    }
    
    if (!bidPerimeters || !bidPolygons || bidPerimeters.length === 0 || bidPolygons.length === 0) {
      console.warn("Failed to process BID geometries for update or empty results");
      bidPerimeters = bidPerimeters || [];
      bidPolygons = bidPolygons || [];
    }
    
    // Create a unique ID prefix to prevent conflicts
    const layerIdPrefix = `${mapId}-${Date.now()}-`;
    
    // Create layers with safety checks
    const layers = [];
    
    // Only add layers if there's valid data
    if (geojsonData.features.length > 0) {
      layers.push(
        new GeoJsonLayer({
          id: `${layerIdPrefix}bid-layer`,
          data: geojsonData,
          pickable: false,
          stroked: true,
          filled: true,
          extruded: false,
          getFillColor: d => {
            const bidName = d.properties?.F_ALL_BI_2;
            const hasProject = bidName && projectBids.includes(bidName);
            const isFocused = bidName && focusBid === bidName;
            
            if (isFocused) return [5, 150, 105, 180]; 
            if (hasProject) return [16, 185, 129, 150]; 
            return [59, 130, 246, 150]; 
          },
          getLineColor: [0, 0, 0, 0],
          getLineWidth: 0,
          parameters: {
            depthTest: false,
            zIndex: 1
          },
          updateTriggers: {
            getFillColor: [projectBids.join(','), focusBid]
          }
        })
      );
    }

    // Only add perimeter layer if there's valid data
    if (bidPerimeters.length > 0) {
      layers.push(
        new GeoJsonLayer({
          id: `${layerIdPrefix}bid-perimeter-layer`,
          data: bidPerimeters,
          pickable: false,
          stroked: false,
          filled: false,
          lineWidthUnits: 'pixels',
          getLineColor: d => {
            const bidName = d.properties?.bidName;
            const hasProject = bidName && projectBids.includes(bidName);
            const isFocused = bidName && focusBid === bidName;
            
            if (isFocused) return [4, 120, 87, 255]; 
            if (hasProject) return [16, 185, 129, 255];
            return [30, 64, 175, 255]; 
          },
          getLineWidth: d => {
            const bidName = d.properties?.bidName;
            const hasProject = bidName && projectBids.includes(bidName);
            const isFocused = bidName && focusBid === bidName;
            
            if (isFocused) return 4;
            if (hasProject) return 3;
            return 2;
          },
          parameters: {
            depthTest: false,
            zIndex: 2
          },
          updateTriggers: {
            getLineColor: [projectBids.join(','), focusBid],
            getLineWidth: [projectBids.join(','), focusBid]
          }
        })
      );
    }

    // Only add interaction layer if there's valid data
    if (bidPolygons.length > 0) {
      layers.push(
        new GeoJsonLayer({
          id: `${layerIdPrefix}bid-interaction-layer`,
          data: bidPolygons,
          pickable: true,
          stroked: false,
          filled: true,
          getFillColor: [0, 0, 0, 0],
          parameters: {
            depthTest: false,
            zIndex: 3
          }
        })
      );
    }
    
    // Only update if we have layers
    if (layers.length === 0) {
      console.warn("No valid layers to update");
      return;
    }
    
    // Update deck overlay props with enhanced error handling
    try {
      // Extra check to ensure overlay hasn't been removed
      if (!deckOverlay._mapId || deckOverlay._mapId !== mapId) {
        console.warn('Overlay appears to be stale or from different map, aborting update');
        return;
      }
      
      deckOverlay.setProps({
        layers,
        onError: (error) => {
          console.error(`Deck.gl error in map ${mapId}:`, error);
        },
        onClick: (info) => {
          // Handle clicks on BID geometries
          if (!info || !info.object) return;
          
          const bidName = info.object.properties?.bidName;
          if (!bidName) return;
          
          const hasProject = projectBids.includes(bidName);
          
          // Only navigate if this BID has a project
          if (hasProject && bidToSlugMap && bidToSlugMap[bidName]) {
            const projectSlug = bidToSlugMap[bidName];
            const baseUrl = getBasePath();
            window.location.href = `${baseUrl}/projects/${projectSlug}`;
          }
        },
        onHover: (info) => {
          // Check if tooltip still exists in DOM
          if (!document.getElementById(tooltipId)) {
            return;
          }
          
          if (!info || !info.object || !tooltip) {
            if (tooltip) tooltip.style.display = 'none';
            return;
          }
          
          const bidName = info.object.properties?.bidName;
          if (!bidName) {
            tooltip.style.display = 'none';
            return;
          }
          
          const hasProject = projectBids.includes(bidName);
          
          tooltip.style.display = 'block';
          tooltip.style.left = `${info.x}px`;
          tooltip.style.top = `${info.y}px`;
          tooltip.style.transform = 'translate(-50%, -100%)';
          tooltip.style.marginTop = '-20px';
          tooltip.style.opacity = '1';
          tooltip.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
          
          tooltip.innerHTML = `
            <div class="tooltip-content" style="font-family: system-ui, sans-serif; padding: 8px; background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <strong>${bidName}</strong>
              ${hasProject ? 
                `<p style="color: #10B981; margin-top: 4px; margin-bottom: 0;">
                  Has project analysis
                  ${bidToSlugMap && bidToSlugMap[bidName] ? 
                    `<span style="font-size: 12px; margin-left: 4px;">(click to view)</span>` : 
                    ''}
                </p>` : 
                '<p style="color: #6B7280; margin-top: 4px; margin-bottom: 0;">No analysis yet</p>'}
            </div>
          `;
        },
        onMouseLeave: () => {
          // Safety check if tooltip still exists
          const tooltipElement = document.getElementById(tooltipId);
          if (!tooltipElement) return;
          
          if (tooltip) tooltip.style.display = 'none';
        }
      });
      
      console.log(`Updated ${layers.length} layers for map ${mapId}`);
    } catch (error) {
      console.error("Error updating deck overlay props:", error);
    }
  } catch (error) {
    console.error("Error updating map layers:", error);
  }
}

