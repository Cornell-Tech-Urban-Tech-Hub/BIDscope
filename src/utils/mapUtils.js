import * as turf from '@turf/turf';

/**
 * Creates perimeter features from BID polygons
 * @param {object} geojsonData - The GeoJSON data containing BID features
 * @returns {Array} Array of perimeter features
 */
export function createBidPerimeters(geojsonData) {
  // Check for valid input data
  if (!geojsonData || !Array.isArray(geojsonData.features)) {
    console.error("Invalid GeoJSON data structure");
    return [];
  }
  
  const bidFeatureGroups = {};
  
  // Group features by BID name
  geojsonData.features.forEach(feature => {
    if (!feature || !feature.properties) return;
    
    const bidName = feature.properties.F_ALL_BI_2;
    if (!bidName) return;
    
    if (!bidFeatureGroups[bidName]) {
      bidFeatureGroups[bidName] = [];
    }
    bidFeatureGroups[bidName].push(feature);
  });
  
  const perimeters = [];
  
  // Process each BID group
  Object.entries(bidFeatureGroups).forEach(([bidName, features]) => {
    try {
      if (!features || features.length === 0) return;
      
      // Skip if first feature is invalid
      if (!features[0] || !features[0].geometry) {
        console.warn(`Invalid feature for BID ${bidName}`);
        return;
      }
      
      // Process each feature with error handling
      const validFeatures = features.filter(f => f && f.geometry);
      if (validFeatures.length === 0) return;
      
      const bufferedFeatures = validFeatures.map(feature => {
        try {
          return turf.buffer(feature, 0.015, {units: 'kilometers'});
        } catch (err) {
          console.warn(`Error buffering feature for BID ${bidName}:`, err);
          return null;
        }
      }).filter(Boolean);
      
      if (bufferedFeatures.length === 0) return;
      
      let combined = bufferedFeatures[0];
      for (let i = 1; i < bufferedFeatures.length; i++) {
        try {
          combined = turf.union(combined, bufferedFeatures[i]);
        } catch (err) {
          console.warn(`Error unioning features for BID ${bidName}:`, err);
          // Continue with current combined shape
        }
      }
      
      // Only proceed if combined is valid
      if (!combined || !combined.geometry) return;
      
      let perimeterFeature;
      
      try {
        if (combined.geometry.type === 'Polygon') {
          const outerRing = combined.geometry.coordinates[0];
          if (!Array.isArray(outerRing)) return;
          perimeterFeature = turf.lineString(outerRing);
        } else if (combined.geometry.type === 'MultiPolygon') {
          const validPolys = combined.geometry.coordinates.filter(
            poly => Array.isArray(poly) && poly.length > 0 && Array.isArray(poly[0])
          );
          if (validPolys.length === 0) return;
          
          const lines = validPolys.map(poly => {
            return turf.lineString(poly[0]);
          });
          perimeterFeature = turf.multiLineString(lines.map(l => l.geometry.coordinates));
        } else {
          return; // Unsupported geometry type
        }
        
        perimeterFeature.properties = { bidName };
        perimeters.push(perimeterFeature);
      } catch (error) {
        console.error(`Error creating perimeter for BID ${bidName}:`, error);
      }
    } catch (error) {
      console.error(`Error processing perimeter for BID ${bidName}:`, error);
    }
  });
  
  return perimeters;
}

/**
 * Creates polygon features from BID geometries
 * @param {object} geojsonData - The GeoJSON data containing BID features
 * @returns {Array} Array of polygon features
 */
export function createBidPolygons(geojsonData) {
  if (!geojsonData || !Array.isArray(geojsonData.features)) {
    return [];
  }
  
  const bidFeatureGroups = {};
  
  geojsonData.features.forEach(feature => {
    const bidName = feature.properties?.F_ALL_BI_2;
    if (!bidName) return;
    
    if (!bidFeatureGroups[bidName]) {
      bidFeatureGroups[bidName] = [];
    }
    bidFeatureGroups[bidName].push(feature);
  });
  
  const polygons = [];
  
  Object.entries(bidFeatureGroups).forEach(([bidName, features]) => {
    try {
      const bufferedFeatures = features.map(feature => turf.buffer(feature, 0.015, {units: 'kilometers'}));
      
      let combined = bufferedFeatures[0];
      for (let i = 1; i < bufferedFeatures.length; i++) {
        combined = turf.union(combined, bufferedFeatures[i]);
      }
      
      combined.properties = { bidName };
      polygons.push(combined);
    } catch (error) {
      console.error(`Error processing polygon for BID ${bidName}:`, error);
    }
  });
  
  return polygons;
}

/**
 * Calculates the bounding box of a feature
 * @param {object} feature - A GeoJSON feature
 * @returns {object} The bounding box coordinates
 */
export function calculateBoundingBox(feature) {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  
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

/**
 * Gets the URL base path safely
 * @returns {string} The base URL with trailing slash removed
 */
export function getBasePath() {
  let base = '';
  try {
    base = import.meta.env.BASE_URL || '/';
    base = base.endsWith('/') ? base.slice(0, -1) : base;
  } catch (e) {
    console.warn('Error accessing BASE_URL:', e);
    base = '';
  }
  return base;
}

/**
 * Safely navigates to a BID project page
 * @param {string} bidName - Name of the BID
 * @param {object} bidToSlugMap - Map of BID names to project slugs
 * @returns {boolean} Success status of navigation attempt
 */
export function navigateToBidProject(bidName, bidToSlugMap) {
  try {
    if (!bidName || !bidToSlugMap || !bidToSlugMap[bidName]) {
      console.warn(`Cannot navigate to BID project: missing slug for ${bidName}`);
      return false;
    }
    
    const projectSlug = bidToSlugMap[bidName];
    const baseUrl = getBasePath();
    window.location.href = `${baseUrl}/bids/${projectSlug}`;
    return true;
  } catch (error) {
    console.error(`Error navigating to BID project ${bidName}:`, error);
    return false;
  }
}
