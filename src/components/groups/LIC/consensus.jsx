import React, { useState } from 'react';

const StreamlitConsensus = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Your Streamlit app URL
  const streamlitUrl = "https://lic-consensus.streamlit.app/?embed=true";
  
  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-4 bg-white shadow-lg mb-4">
        <h2 className="text-xl font-semibold">LIC Consensus - Interactive Tool</h2>
      </div>
      
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-2"></div>
              <p>Loading Streamlit App...</p>
            </div>
          </div>
        )}
        
        <iframe
          src={streamlitUrl}
          title="BID Intervention Analysis"
          width="100%"
          height="100%"
          style={{
            border: 'none',
            borderRadius: '4px',
            minHeight: '600px'
          }}
          onLoad={() => setIsLoading(false)}
          allow="camera;microphone;clipboard-read;clipboard-write;"
        />
      </div>
    </div>
  );
};

export default StreamlitConsensus;