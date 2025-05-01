import React from 'react';
import RobotabilityMap from '../groups/_matt_demo/RobotabilityMap.jsx';
// Import all other visualization components you need
// import OtherComponent from '../path/to/OtherComponent';
import StreamlitTransformation from '../groups/LIC/transformation.jsx';
import InsightComponent from '../groups/LIC/insight.jsx';
import StreamlitConsensus from '../groups/LIC/consensus.jsx';
import PredictionComponent from '../groups/LIC/prediction.jsx'
import WestVillageStreetView from '../groups/west-village/WestVillageStreetView.jsx';

import InsightIframe from '../groups/dtbk/InsightIframe.jsx';
import TransformationIframe from '../groups/dtbk/TransformationIframe.jsx';


// Map component paths to their actual component implementations
const componentRegistry = {
  // Key should match the path specified in content files (without the full path)
  'RobotabilityMap': RobotabilityMap,
  '_matt_demo/RobotabilityMap': RobotabilityMap,
  'groups/_matt_demo/RobotabilityMap': RobotabilityMap,
  'src/components/groups/_matt_demo/RobotabilityMap': RobotabilityMap,
  'src/components/groups/_matt_demo/RobotabilityMap.jsx': RobotabilityMap,
  
  // Add all other components following the same pattern
  // 'ComponentName': ComponentReference,

  // LIC components
  'groups/LIC/transformation': StreamlitTransformation,
  'groups/LIC/transformation.jsx': StreamlitTransformation,
  'src/components/groups/LIC/transformation': StreamlitTransformation,
  'src/components/groups/LIC/transformation.jsx': StreamlitTransformation,
  
  'groups/LIC/insight': InsightComponent,
  'groups/LIC/insight.jsx': InsightComponent,
  'src/components/groups/LIC/insight': InsightComponent,
  'src/components/groups/LIC/insight.jsx': InsightComponent,

  'groups/LIC/consensus': StreamlitConsensus,
  'groups/LIC/consensus.jsx': StreamlitConsensus,
  'src/components/groups/LIC/consensus': StreamlitConsensus,
  'src/components/groups/LIC/consensus.jsx': StreamlitConsensus,
  
  'groups/LIC/prediction': PredictionComponent,
  'groups/LIC/prediction.jsx': PredictionComponent,
  'src/components/groups/LIC/prediction': PredictionComponent,
  'src/components/groups/LIC/prediction.jsx': PredictionComponent,
  
  // West Village components
  'WestVillageStreetView': WestVillageStreetView,
  'visualizations/WestVillageStreetView': WestVillageStreetView,
  'src/components/visualizations/WestVillageStreetView': WestVillageStreetView,
  'src/components/visualizations/WestVillageStreetView.jsx': WestVillageStreetView,

  // DTBK components
  "src/components/groups/dtbk/InsightIframe.jsx": InsightIframe,
  "src/components/groups/dtbk/TransformationIframe.jsx": TransformationIframe,
};

// External component loader - loads a YouTube embed or other external content
const ExternalComponent = ({ src }) => {
  if (src.includes('youtube.com/embed/')) {
    return (
      <div className="aspect-video w-full">
        <iframe 
          src={src}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }
  return <p>Unsupported external component: {src}</p>;
};

// Helper function to get the component by path
export function getComponentByPath(path) {
  // Handle external URLs (like YouTube)
  if (path.startsWith('http')) {
    return props => <ExternalComponent src={path} {...props} />;
  }
  
  // Clean up the path to match our registry keys
  // Remove common prefixes
  const normalizedPath = path
    .replace(/^\/components\//, '')
    .replace(/^src\/components\//, '')
    .replace(/^\/src\/components\//, '');
  
  // Try different variations of the path to find a match
  const component = 
    componentRegistry[path] || 
    componentRegistry[normalizedPath] || 
    componentRegistry[normalizedPath.replace(/\.jsx$/, '')] ||
    componentRegistry[normalizedPath.split('/').pop().replace(/\.jsx$/, '')];
  
  if (!component) {
    console.warn(`Component not found in registry: ${path}`);
    return () => <p className="error-message">Component not found: {path}</p>;
  }
  
  return component;
}
