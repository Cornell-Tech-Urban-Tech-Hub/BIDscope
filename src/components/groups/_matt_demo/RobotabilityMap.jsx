import React, { useState, useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { GeoJsonLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';

// Define VideoPlayer component outside the main component to avoid recreation on each render
const VideoPlayer = React.memo(({ deployment, isVisible = true, onClose }) => {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${deployment.videoId}?start=${deployment.startTime}&end=${deployment.endTime}&rel=0&modestbranding=1&autoplay=1&enablejsapi=1`;
  const iframeRef = useRef(null);
  
  // Handle visibility changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (!isVisible) {
        // Post message to pause the video
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        // Post message to play the video
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
    }
  }, [isVisible]);

  if (!isVisible) return null; // Don't render if not visible

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="p-3 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">{deployment.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="relative aspect-video">
        <iframe
          ref={iframeRef}
          key={`${deployment.videoId}-${deployment.startTime}`}
          src={`${embedUrl}&origin=${window.location.origin}`}
          title={deployment.name}
          className="w-full h-full"
          style={{ minHeight: '200px' }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
});

const COLORS = [
  [165, 0, 38],    // Dark red
  [215, 48, 39],   // Red
  [244, 109, 67],  // Light red
  [253, 174, 97],  // Orange-red
  [254, 224, 144], // Light orange
  [255, 255, 191], // Yellow
  [217, 239, 139], // Light yellow-green
  [166, 217, 106], // Light green
  [102, 189, 99],  // Medium green
  [26, 152, 80],   // Green
  [0, 104, 55]     // Dark green
];

const DEPLOYMENTS = {
  'Elmhurst, Queens': {
    coords: [40.738536, -73.887267],
    videoId: 'o52MZ1AHyjA',
    startTime: 44,
    endTime: 62
  },
  'Sutton Place, Manhattan': {
    coords: [40.758890, -73.958457],
    videoId: 'o52MZ1AHyjA',
    startTime: 21,
    endTime: 43
  },
  'Herald Square, Manhattan': {
    coords: [40.748422, -73.988275],
    videoId: 'o52MZ1AHyjA',
    startTime: 63,
    endTime: 83
  },
  'Jackson Heights, Queens': {
    coords: [40.747379, -73.889690],
    videoId: 'o52MZ1AHyjA',
    startTime: 85,
    endTime: 100
  }
};

// Dictionary to give layers nice names 
const layerNames = {
  sidewalkScores: 'Sidewalk Scores',
  censusBlocks: 'Census Blocks',
  deploymentLocations: 'Deployment Locations'
};

const RobotabilityMap = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [deckgl, setDeckgl] = useState(null);
  const [firstLabelLayerId, setFirstLabelLayerId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);
  const tooltipRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [mapData, setMapData] = useState({
    sidewalks: null,
    censusBlocks: null
  });
  const [visibleLayers, setVisibleLayers] = useState({
    sidewalkScores: true,
    censusBlocks: true,
    deploymentLocations: true
  });
  const [selectedDeployment, setSelectedDeployment] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  // Update sidebar width
  useEffect(() => {
    const updateSidebarWidth = () => {
      if (sidebarRef.current) {
        setSidebarWidth(sidebarRef.current.offsetWidth);
      }
    };
  
    updateSidebarWidth();
    window.addEventListener('resize', updateSidebarWidth);
    return () => window.removeEventListener('resize', updateSidebarWidth);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [-73.9712, 40.7831],
      zoom: 12,
      pitch: 45,
      bearing: 0
    });

    mapInstance.on('style.load', () => {
      const firstLabelLayer = mapInstance.getStyle().layers.find(layer => 
        layer.type === 'symbol' || layer.id.includes('label') || layer.id.includes('place')
      );
      setFirstLabelLayerId(firstLabelLayer.id);
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Setup DeckGL and tooltip
  useEffect(() => {
    if (!map) return;

    // Create tooltip if it doesn't exist
    if (!tooltipRef.current) {
      const tooltip = document.createElement('div');
      tooltip.style.display = 'none';
      tooltip.style.position = 'absolute';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.zIndex = '100';
      tooltip.style.backgroundColor = 'white';
      tooltip.style.padding = '8px 12px';
      tooltip.style.borderRadius = '6px';
      tooltip.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      document.body.appendChild(tooltip);
      tooltipRef.current = tooltip;
    }

    const overlay = new MapboxOverlay({
      interleaved: true,
      layers: [],
      onHover: (info) => {
        const tooltip = tooltipRef.current;
        if (!tooltip) return;

        if (info.object) {
          const x = info.x + (isSidebarOpen ? sidebarWidth : 0);
          const y = info.y;
          
          tooltip.style.display = 'block';
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
          tooltip.style.transform = 'translate(-50%, -100%)';
          tooltip.style.marginTop = '-10px';

          if (info.layer.id === 'deployment-zones' && info.object.properties?.name) {
            tooltip.innerHTML = `
              <div class="font-semibold">${info.object.properties.name}</div>
              <div class="text-sm text-gray-600">Click to view deployment</div>
            `;
          } else if (info.layer.id === 'sidewalks' && info.object.properties?.score) {
            tooltip.innerHTML = `Score: ${(info.object.properties.score * 100).toFixed(1)}%`;
          }
        } else {
          tooltip.style.display = 'none';
        }
      }
    });

    map.addControl(overlay);
    setDeckgl(overlay);

    return () => {
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
      map.removeControl(overlay);
    };
  }, [map, isSidebarOpen, sidebarWidth]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get base URL for proper path resolution in production
        const baseUrl = document.querySelector('meta[name="astro:base"]')?.getAttribute('content') || '';
        
        // Fix paths with baseUrl if needed
        const sidewalksPath = '/components/groups/_matt_demo/sidewalks.geojson'
          
        const censusPath = '/components/groups/_matt_demo/census.geojson'
        
        console.log(`Loading data from: ${sidewalksPath} and ${censusPath}`);
        
        // Load both datasets in parallel
        const [sidewalksRes, censusRes] = await Promise.all([
          fetch(sidewalksPath),
          fetch(censusPath)
        ]);

        if (!sidewalksRes.ok) {
          throw new Error(`Failed to load sidewalks data: ${sidewalksRes.status} ${sidewalksRes.statusText}`);
        }
        
        if (!censusRes.ok) {
          throw new Error(`Failed to load census data: ${censusRes.status} ${censusRes.statusText}`);
        }

        const [sidewalksData, censusData] = await Promise.all([
          sidewalksRes.json(),
          censusRes.json()
        ]);

        console.log('Data loaded successfully');
        setMapData({
          sidewalks: sidewalksData,
          censusBlocks: censusData
        });
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };

    loadData();
  }, []);

  // Create rings for each deployment location
  const createDeploymentRings = useCallback(() => {
    const features = [];
    const numRings = 15;
    const maxRadius = 0.004; // roughly 400 meters
    const maxHeight = 250;

    Object.entries(DEPLOYMENTS).forEach(([name, info]) => {
      for (let i = 0; i < numRings; i++) {
        const progress = i / (numRings - 1);
        const radius = Math.cos(progress * Math.PI / 2) * maxRadius;
        const height = Math.sin(progress * Math.PI / 2) * maxHeight;

        // Create a circle for each ring
        const points = 32; // number of points to approximate circle
        const coords = [];
        for (let j = 0; j <= points; j++) {
          const angle = (j / points) * Math.PI * 2;
          const lng = info.coords[1] + Math.cos(angle) * radius;
          const lat = info.coords[0] + Math.sin(angle) * radius;
          coords.push([lng, lat]);
        }

        features.push({
          type: 'Feature',
          properties: {
            name,
            video: info.video,
            height,
            opacity: 0.3 * (1 - progress),  // fade out as it goes up
            level: i
          },
          geometry: {
            type: 'Polygon',
            coordinates: [coords]
          }
        });
      }
    });

    return {
      type: 'FeatureCollection',
      features
    };
  }, []);

  // Deployment click handler
  const handleDeploymentSelect = useCallback((deploymentName) => {
    if (deploymentName && DEPLOYMENTS[deploymentName]) {
      const [lat, lng] = DEPLOYMENTS[deploymentName].coords;
      
      // Only update video if it's a different deployment
      if (!activeVideo || activeVideo.name !== deploymentName) {
        const deployment = DEPLOYMENTS[deploymentName];
        setActiveVideo({
          name: deploymentName,
          videoId: deployment.videoId,
          startTime: deployment.startTime,
          endTime: deployment.endTime
        });
      }
      
      map?.flyTo({
        center: [lng, lat],
        zoom: 16,
        duration: 2000,
        pitch: 60
      });
    }
  }, [map, activeVideo]);

  const handleDeploymentClick = useCallback(({object}) => {
    if(object?.properties?.name) {
      const deploymentName = object.properties.name;
      const deployment = DEPLOYMENTS[deploymentName];
      
      if (deployment && (!activeVideo || activeVideo.name !== deploymentName)) {
        setActiveVideo({
          name: deploymentName,
          videoId: deployment.videoId,
          startTime: deployment.startTime,
          endTime: deployment.endTime
        });
        
        map?.flyTo({
          center: [deployment.coords[1], deployment.coords[0]],
          zoom: 16,
          duration: 2000,
          pitch: 60
        });
      }
    }
  }, [map, activeVideo]);

  // Update layers when visibility changes or data loads
  useEffect(() => {
    if (!deckgl || !mapData.sidewalks || !firstLabelLayerId) return;

    const layers = [];

    if (visibleLayers.censusBlocks && mapData.censusBlocks) {
      layers.push(
        new GeoJsonLayer({
          id: 'census-blocks',
          data: mapData.censusBlocks,
          pickable: false,
          stroked: true,
          filled: false,
          lineWidthScale: 3,
          getLineColor: [100, 100, 100, 100],
          beforeId: firstLabelLayerId
        })
      );
    }

    if (visibleLayers.deploymentLocations) {
      layers.push(
        new GeoJsonLayer({
          id: 'deployment-zones',
          data: createDeploymentRings(),
          pickable: true,
          onClick: handleDeploymentClick,
          stroked: false,
          filled: true,
          extruded: true,
          wireframe: false,
          getElevation: d => d.properties.height,
          getFillColor: d => [0, 128, 255, 255 * d.properties.opacity],
          parameters: {
            depthTest: false,
            depthMask: true,
            zIndex: 2,
            blend: true,
            blendFunc: [
              WebGLRenderingContext.SRC_ALPHA,
              WebGLRenderingContext.ONE_MINUS_SRC_ALPHA
            ]
          }
        })
      );
    }

    if (visibleLayers.sidewalkScores && mapData.sidewalks) {
      layers.push(
        new GeoJsonLayer({
          id: 'sidewalks',
          data: mapData.sidewalks,
          pickable: true,
          stroked: true,
          filled: true,
          lineWidthScale: 12,
          beforeId: firstLabelLayerId,
          getLineColor: d => {
            const score = d.properties?.score ?? 0;
            const colorIndex = Math.floor(score * 2.5 *(COLORS.length - 1));
            return [COLORS[colorIndex], 255];
          },
          getFillColor: d => {
            const score = d.properties?.score ?? 0;
            const colorIndex = Math.floor(score * (COLORS.length - 1));
            return [...COLORS[colorIndex], 255];
          },
          parameters: {
            depthTest: false,
            zIndex: 1
          }
        })
      );
    }

    // Update deck.gl layers
    deckgl.setProps({ layers });
  }, [deckgl, mapData, visibleLayers, map, firstLabelLayerId, createDeploymentRings, handleDeploymentClick]);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
    // Add small delay to allow state to update
    setTimeout(() => {
      if (sidebarRef.current) {
        setSidebarWidth(sidebarRef.current.offsetWidth);
      }
    }, 300);
  }, []);

  const handleCloseVideo = useCallback(() => {
    setActiveVideo(null);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col lt-md:flex-col md:flex-row relative" style={{ minHeight: '500px' }}>
      {/* Home Button. Put to the right of the sidebar toggle button */}
      <a
        href="/"
        className="
          absolute top-4 right-4
          flex flex-col items-center
          bg-white rounded-lg p-2 shadow-lg z-30
        "
      >
        <img 
          src="/src/components/groups/_matt_demo/trashbot.png" 
          alt="Home" 
          className="w-24 h-24 rounded-full object-cover"
        />
        <span className="poppins text-sm mt-1">Home</span>
      </a>

      {/* Controls Container - Sidebar on desktop, Top section on mobile */}
      <div 
        ref={sidebarRef} 
        className={`
          absolute left-0 top-0
          md:h-full lt-md:h-auto 
          bg-white shadow-lg z-10
          transition-all duration-300
          lt-md:w-full
          md:w-[32rem]
          ${!isSidebarOpen ? 'md:-translate-x-full' : ''}
        `}
      >
        {/* Sidebar Toggle Button - Only on desktop */}
        <button
          onClick={handleSidebarToggle}
          className="
            md:block lt-md:hidden
            absolute -right-14 top-4
            bg-white rounded-lg p-2
            shadow-lg z-30
          "
        >
          <span className="poppins text-xl">
            {isSidebarOpen ? '←' : '→'}
          </span>
        </button>

        {/* Sidebar Content */}
        <div className={`
          p-4 overflow-x-hidden
          transition-all duration-300
          ${!isSidebarOpen ? 'md:opacity-0 md:invisible md:w-0 md:-translate-x-full' : 'md:opacity-100 md:visible md:w-auto md:translate-x-0'}
        `}>
          <div className="mb-4">
            <h3 className="poppins text-xl font-semibold italic mb-4">Robotability Proof-of-Concept</h3>
            <p className="poppins mb-4">New York City, September 2024</p>
            <select 
              className="poppins w-full p-2 border rounded"
              value={selectedDeployment}
              onChange={(e) => {
                setSelectedDeployment(e.target.value);
                if (e.target.value) {
                  handleDeploymentSelect(e.target.value);
                } else {
                  setActiveVideo(null);
                }
              }}
            >
              <option value="">Select Deployment</option>
              {Object.keys(DEPLOYMENTS).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <h3 className="poppins text-lg font-semibold mb-2">Layers</h3>
            <div className="
              flex flex-wrap gap-4 
              lt-md:justify-start md:flex-col
            ">
              {Object.entries(visibleLayers).map(([key, value]) => (
                <label 
                  key={key} 
                  className="
                    poppins flex items-center 
                    lt-md:w-[calc(50%-0.5rem)] md:w-full
                  "
                >
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => {
                      setVisibleLayers(prev => ({
                        ...prev,
                        [key]: !prev[key]
                      }));
                    }}
                    className="mr-2"
                  />
                  {layerNames[key]}
                </label>
              ))}
            </div>
          </div>

          {/* Score Legend - Only visible on desktop */}
          <div className="lt-md:hidden md:block mb-8">
            <h4 className="poppins text-lg font-semibold mb-2">Score Legend</h4>
            <div className="bg-gray-100 p-4 rounded flex flex-wrap justify-center gap-1">
              {COLORS.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5"
                  style={{
                    backgroundColor: `rgb(${color.join(',')})`
                  }}
                />
              ))}
            </div>
            <p className="poppins text-center mt-2">Low Percentile → High Percentile</p>
          </div>

          {/* Video Player - Only visible on desktop */}
          {activeVideo && (
            <div className="lt-md:hidden md:block mt-8">
              <VideoPlayer 
                deployment={activeVideo} 
                isVisible={isSidebarOpen && window.innerWidth >= 768}
                onClose={handleCloseVideo}
              />
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className={`
        relative
        transition-all duration-300
        ${!isSidebarOpen ? 'md:w-full' : 'md:w-[calc(100%-32rem)] md:ml-[32rem]'}
        lt-md:w-full
        lt-md:flex-1
      `}
      style={{ minHeight: '500px' }}
      >
        <div 
          ref={mapContainer} 
          className="absolute inset-0"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '500px'
          }}
        />
      </div>

      {/* Video Footer - Only visible on mobile when video is active */}
      {activeVideo && (
        <div className="
          lt-md:block md:hidden
          w-full bg-white shadow-lg
          border-t border-gray-200
          h-auto max-h-[40vh]
          z-20
        ">
          <VideoPlayer 
            deployment={activeVideo} 
            isVisible={window.innerWidth < 768}
            onClose={handleCloseVideo}
          />
        </div>
      )}
    </div>
  );
};

export default RobotabilityMap;