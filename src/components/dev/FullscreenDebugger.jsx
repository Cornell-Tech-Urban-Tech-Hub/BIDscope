import React, { useState, useEffect } from 'react';

/**
 * Debugging component for fullscreen mode
 * Only displayed in development mode
 */
export default function FullscreenDebugger({ enabled = false }) {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    // Check for fullscreen manager
    if (!window.fullscreenManager) {
      console.warn('FullscreenDebugger: No fullscreen manager found');
      return;
    }
    
    // Enable debug mode
    window.fullscreenManager.setDebugMode(true);
    
    // Toggle button
    const debugButton = document.createElement('button');
    debugButton.innerText = 'Debug FS';
    debugButton.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:20001;background:#222;color:#fff;padding:5px 10px;border-radius:4px;';
    document.body.appendChild(debugButton);
    debugButton.addEventListener('click', () => setVisible(v => !v));
    
    // Subscribe to events
    const updateEvents = () => {
      setLogs([...window.fullscreenManager.logs]);
      setIsActive(window.fullscreenManager.state.isActive);
    };
    
    window.fullscreenManager.subscribe('beforeEnter', updateEvents);
    window.fullscreenManager.subscribe('afterEnter', updateEvents);
    window.fullscreenManager.subscribe('beforeExit', updateEvents);
    window.fullscreenManager.subscribe('afterExit', updateEvents);
    window.fullscreenManager.subscribe('error', updateEvents);
    
    // Initial update
    updateEvents();
    
    // Clean up
    return () => {
      if (debugButton.parentElement) {
        debugButton.parentElement.removeChild(debugButton);
      }
    };
  }, [enabled]);
  
  if (!enabled || !visible) return null;
  
  return (
    <div className="fsm-debug-panel">
      <div className="fsm-header">
        <h3>Fullscreen Debug {isActive ? '(ACTIVE)' : '(inactive)'}</h3>
        <button onClick={() => setLogs([])}>Clear</button>
        <button onClick={() => setVisible(false)}>Close</button>
      </div>
      
      <div className="fsm-logs">
        {logs.map((log, i) => (
          <div key={i} className="fsm-log">
            <div className="fsm-timestamp">{log.timestamp}</div>
            <div className="fsm-message">{log.message}</div>
            {log.data && (
              <div className="fsm-data">
                {typeof log.data === 'object' ? 
                  JSON.stringify(log.data, null, 2) : 
                  log.data.toString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
