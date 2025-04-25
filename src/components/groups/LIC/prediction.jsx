import React from 'react';

const InsightComponent = () => {
  return (
    <div className="h-full w-full flex flex-col">
        <div className="p-4 bg-white shadow-lg mb-4">
            <h2 className="text-xl font-semibold">Please see the Transformation and Effects sections</h2>
        </div>
      
      <div className="flex-1">
        <iframe 
          src="https://storymaps.arcgis.com/stories/fbea43d8f238460c9fa503d6362cca6c" 
          width="100%" 
          height="100%" 
          style={{
            border: 'none',
            minHeight: '600px'
          }}
          frameBorder="0" 
          allowFullScreen 
          allow="geolocation"
        />
      </div>
    </div>
  );
};

export default InsightComponent;