import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
// Add Turf.js import
import * as turf from '@turf/turf';

// Add proper TypeScript interface for the props
interface MapVisualizerProps {
  projectBids: string[];
  focusBid?: string | null;
}

export default function MapVisualizer({ projectBids = [], focusBid = null }: MapVisualizerProps) {
  return (
    <div className="relative">
      <div id="map-container" className="w-full h-[500px] bg-card rounded-lg border relative"></div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Interactive map of NYC Business Improvement Districts
        {focusBid && <span className="font-medium"> • Focused on: {focusBid}</span>}
      </p>
      <DeckGLMap projectBids={projectBids} focusBid={focusBid} />
    </div>
  );
}

// Also add type for the internal component
interface DeckGLMapProps {
  projectBids: string[];
  focusBid?: string | null;
}

function DeckGLMap({ projectBids, focusBid }: DeckGLMapProps) {
  // Only execute client-side
  if (typeof window === 'undefined') return null;
  
  useEffect(() => {
    // Dynamically load Deck.gl components
    const loadDeckGL = async () => {
      try {
        // Import required libraries
        const { GeoJsonLayer } = await import('@deck.gl/layers');
        const { MapboxOverlay } = await import('@deck.gl/mapbox');
        const { default: maplibregl } = await import('maplibre-gl');
        
        // Load GeoJSON data
        const response = await fetch('/data/bids.geojson');
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status} ${response.statusText}`);
        }
        
        const geojsonData = await response.json();
        
        // Process the GeoJSON to extract BID perimeters
        const bidPerimeters = createBidPerimeters(geojsonData);
        
        // Find focus feature if needed
        let viewState = {
          latitude: 40.7128,
          longitude: -74.0060,
          zoom: 11,
          pitch: 0,
          bearing: 0
        };
        
        // Adjust view for focus BID if specified
        if (focusBid) {
          const focusFeature = geojsonData.features.find(
            feature => feature.properties?.F_ALL_BI_2 === focusBid
          );
          
          if (focusFeature && focusFeature.geometry) {
            // Use existing calculateBoundingBox function
            if (focusFeature.geometry.type === 'Polygon' || focusFeature.geometry.type === 'MultiPolygon') {
              const bbox = calculateBoundingBox(focusFeature);
              viewState = {
                ...viewState,
                latitude: (bbox.maxLat + bbox.minLat) / 2,
                longitude: (bbox.maxLng + bbox.minLng) / 2,
                zoom: 13
              };
            }
          }
        }
        
        // Set up the map container
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) {
          console.error("Map container not found");
          return;
        }
        
        // Clear any existing elements
        while (mapContainer.firstChild) {
          mapContainer.removeChild(mapContainer.firstChild);
        }
        
        // Create maplibre map root
        const mapRoot = document.createElement('div');
        mapRoot.id = 'maplibre-map';
        mapRoot.style.width = '100%';
        mapRoot.style.height = '100%';
        mapRoot.style.borderRadius = '0.5rem';
        mapContainer.appendChild(mapRoot);
        
        // Create tooltip container
        const tooltip = document.createElement('div');
        tooltip.id = 'deck-tooltip';
        tooltip.style.display = 'none';
        tooltip.style.position = 'absolute';
        tooltip.style.zIndex = '1000';
        tooltip.style.pointerEvents = 'none';
        mapContainer.appendChild(tooltip);
        
        // Initialize MapLibre map
        const map = new maplibregl.Map({
          container: 'maplibre-map',
          style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // Clean, professional basemap
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch,
          minZoom: 9 // Restrict zoom out to keep focus on NYC area
        });
        
        map.on('style.load', () => {
          // Find the first label layer
          const firstLabelLayer = map.getStyle().layers.find(layer => 
            layer.type === 'symbol' || layer.id.includes('label') || layer.id.includes('place')
          );
          
          const firstLabelLayerId = firstLabelLayer?.id;
          
          // Process data for interaction layer
          const bidPolygons = createBidPolygons(geojsonData);

          // Create the BID layer - explicitly NOT pickable
          const bidLayer = new GeoJsonLayer({
            id: 'bid-layer',
            data: geojsonData,
            pickable: false, // Explicitly not pickable
            stroked: true,
            filled: true,
            extruded: false,
            beforeId: firstLabelLayerId,
            getFillColor: d => {
              const bidName = d.properties?.F_ALL_BI_2;
              const hasProject = projectBids.includes(bidName);
              const isFocused = focusBid === bidName;
              
              if (isFocused) return [5, 150, 105, 180]; // Green with focus
              if (hasProject) return [16, 185, 129, 150]; // Green
              return [59, 130, 246, 150]; // Blue
            },
            getLineColor: [0, 0, 0, 0], // Make individual polygon boundaries invisible
            getLineWidth: 0,
            parameters: {
              depthTest: false,
              zIndex: 1
            }
          });
          
          // Add the perimeter outline layer - explicitly NOT pickable
          const perimeterLayer = new GeoJsonLayer({
            id: 'bid-perimeter-layer',
            data: bidPerimeters,
            pickable: false, // Explicitly not pickable
            stroked: false,
            filled: false,
            lineWidthUnits: 'pixels',
            getLineColor: d => {
              const bidName = d.properties?.bidName;
              const hasProject = projectBids.includes(bidName);
              const isFocused = focusBid === bidName;
              
              if (isFocused) return [4, 120, 87, 255]; // Darker green for focus
              if (hasProject) return [16, 185, 129, 255]; // Green
              return [30, 64, 175, 255]; // Blue
            },
            getLineWidth: d => {
              const bidName = d.properties?.bidName;
              const hasProject = projectBids.includes(bidName);
              const isFocused = focusBid === bidName;
              
              if (isFocused) return 4;
              if (hasProject) return 3;
              return 2;
            },
            parameters: {
              depthTest: false,
              zIndex: 2 // Ensure it renders above the fill layer
            }
          });

          // Add invisible interaction layer covering entire BID areas - ONLY this layer is pickable
          const interactionLayer = new GeoJsonLayer({
            id: 'bid-interaction-layer',
            data: bidPolygons,
            pickable: true, // This is the ONLY pickable layer
            stroked: false,
            filled: true,
            getFillColor: [0, 0, 0, 0], // Completely transparent
            parameters: {
              depthTest: false,
              zIndex: 3 // Top layer for interactions
            }
          });
          
          // Create and add the MapboxOverlay
          const deckOverlay = new MapboxOverlay({
            interleaved: true,
            layers: [bidLayer, perimeterLayer, interactionLayer],
            onHover: (info) => {
              // Simple direct hover handling with no debouncing
              if (info.object) {
                // Remove cursor style change
                // map.getCanvas().style.cursor = 'pointer';
                
                // Handle tooltip display
                const bidName = info.object.properties?.bidName;
                const hasProject = projectBids.includes(bidName);
                
                tooltip.style.display = 'block';
                tooltip.style.left = `${info.x}px`;
                tooltip.style.top = `${info.y}px`;
                tooltip.style.transform = 'translate(-50%, -100%)';
                tooltip.style.marginTop = '-20px'; // Increased from -10px to move tooltip up
                
                tooltip.innerHTML = `
                  <div style="font-family: system-ui, sans-serif; padding: 8px; background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <strong>${bidName}</strong>
                    ${hasProject ? 
                      '<p style="color: #10B981; margin-top: 4px; margin-bottom: 0;">Has project analysis</p>' : 
                      '<p style="color: #6B7280; margin-top: 4px; margin-bottom: 0;">No analysis yet</p>'}
                  </div>
                `;
              } else {
                // Remove cursor style change
                // map.getCanvas().style.cursor = '';
                tooltip.style.display = 'none';
              }
            },
            onClick: ({object}) => {
              if (object) {
                // Only need to check the bidName property since we're only using the interaction layer
                const bidName = object.properties?.bidName;
                const hasProject = projectBids.includes(bidName);
                
                if (hasProject) {
                  window.location.href = `/projects#${encodeURIComponent(bidName)}`;
                }
              }
            }
          });
          
          // Add the overlay to the map
          map.addControl(deckOverlay);
        });
        
        // Cleanup function
        return () => {
          // Remove timeout cleanup since we're not using timeouts anymore
          map.remove();
          if (mapContainer) {
            while (mapContainer.firstChild) {
              mapContainer.removeChild(mapContainer.firstChild);
            }
          }
        };
      } catch (error) {
        console.error("Error initializing Deck.gl map:", error);
      }
    };
    
    const cleanup = loadDeckGL();
    
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => {
          if (cleanupFn && typeof cleanupFn === 'function') {
            cleanupFn();
          }
        });
      }
    };
  }, [projectBids, focusBid]);
  
  return null;
}

// Helper function to calculate bounding box from GeoJSON feature
function calculateBoundingBox(feature) {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  
  // ... existing implementation ...
  const processCoordinates = coords => {
    if (Array.isArray(coords[0]) && typeof coords[0][0] !== 'number') {
      coords.forEach(processCoordinates);
    } else if (Array.isArray(coords[0])) {
      coords.forEach(point => {
        minLng = Math.min(minLng, point[0]);
        maxLng = Math.max(maxLng, point[0]);
        minLat = Math.min(minLat, point[1]);
        maxLat = Math.max(maxLat, point[1]);
      });
    }
  };
  
  processCoordinates(feature.geometry.coordinates);
  
  return { minLng, minLat, maxLng, maxLat };
}

// Function to create perimeter features for each BID
function createBidPerimeters(geojsonData) {
  // Group features by BID name
  const bidFeatureGroups = {};
  
  geojsonData.features.forEach(feature => {
    const bidName = feature.properties?.F_ALL_BI_2;
    if (!bidName) return;
    
    if (!bidFeatureGroups[bidName]) {
      bidFeatureGroups[bidName] = [];
    }
    bidFeatureGroups[bidName].push(feature);
  });
  
  // Create perimeter features for each BID
  const perimeters = [];
  
  Object.entries(bidFeatureGroups).forEach(([bidName, features]) => {
    try {
      // First create a feature collection
      const collection = turf.featureCollection(features);
      
      // For disjoint polygons, we need to use a buffer-based approach
      // First, create a small buffer around each polygon (in meters)
      const bufferedFeatures = features.map(feature => turf.buffer(feature, 0.015, {units: 'kilometers'}));
      
      // Combine all buffered features using union
      let combined = bufferedFeatures[0];
      for (let i = 1; i < bufferedFeatures.length; i++) {
        combined = turf.union(combined, bufferedFeatures[i]);
      }
      
      // Now we can extract the perimeter
      let perimeterFeature;
      
      if (combined.geometry.type === 'Polygon') {
        // For a single polygon, just take the outer ring
        const outerRing = combined.geometry.coordinates[0];
        perimeterFeature = turf.lineString(outerRing);
      } else if (combined.geometry.type === 'MultiPolygon') {
        // For multipolygons, take each polygon's outer ring
        const lines = combined.geometry.coordinates.map(poly => {
          return turf.lineString(poly[0]); // Just the outer ring
        });
        perimeterFeature = turf.multiLineString(lines.map(l => l.geometry.coordinates));
      }
      
      // Add the BID name as a property
      perimeterFeature.properties = { bidName };
      perimeters.push(perimeterFeature);
      
    } catch (error) {
      console.error(`Error processing perimeter for BID ${bidName}:`, error);
    }
  });
  
  return perimeters;
}

// Function to create polygon features for interaction layer
function createBidPolygons(geojsonData) {
  // Group features by BID name
  const bidFeatureGroups = {};
  
  geojsonData.features.forEach(feature => {
    const bidName = feature.properties?.F_ALL_BI_2;
    if (!bidName) return;
    
    if (!bidFeatureGroups[bidName]) {
      bidFeatureGroups[bidName] = [];
    }
    bidFeatureGroups[bidName].push(feature);
  });
  
  // Create unified polygon features for each BID
  const polygons = [];
  
  Object.entries(bidFeatureGroups).forEach(([bidName, features]) => {
    try {
      // For better interaction, use a slightly larger buffer for the interaction layer
      const bufferedFeatures = features.map(feature => turf.buffer(feature, 0.015, {units: 'kilometers'}));
      
      // Combine all buffered features using union
      let combined = bufferedFeatures[0];
      for (let i = 1; i < bufferedFeatures.length; i++) {
        combined = turf.union(combined, bufferedFeatures[i]);
      }
      
      // Add BID name as property
      combined.properties = { bidName };
      polygons.push(combined);
    } catch (error) {
      console.error(`Error processing polygon for BID ${bidName}:`, error);
    }
  });
  
  return polygons;
}