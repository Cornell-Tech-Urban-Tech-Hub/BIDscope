import React from 'react';

const InsightIframe = () => {
  const iframeSrc = "https://ryanhlewis.github.io/urbandesign/brooklyn/bidpermits/";

  return (
    <div style={{ width: '100%', height: '600px' }}> {/* Optional: Add a container div for styling */}
      <iframe
        src={iframeSrc}
        title="Downtown Brooklyn BID Permits Visualization"
        width="100%"
        height="100%"
        style={{ border: 'none' }} // Optional: Remove default iframe border
        allowFullScreen // Optional: Allow fullscreen if the content supports it
      >
        Your browser does not support iframes.
      </iframe>
    </div>
  );
};

export default InsightIframe;