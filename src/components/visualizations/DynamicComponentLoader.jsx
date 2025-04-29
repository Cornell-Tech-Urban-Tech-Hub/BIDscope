import React, { Suspense } from 'react';
import { getComponentByPath } from './ComponentRegistry';

const DynamicComponentLoader = ({ componentPath, ...props }) => {
  if (!componentPath) {
    return <div className="error-message">No component path provided</div>;
  }

  try {
    const Component = getComponentByPath(componentPath);
    
    return (
      <Suspense fallback={<div className="loading">Loading component...</div>}>
        <Component {...props} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading component:", error);
    return (
      <div className="error-message">
        <p>Error loading component: {componentPath}</p>
        <p>{error.message}</p>
      </div>
    );
  }
};

export default DynamicComponentLoader;