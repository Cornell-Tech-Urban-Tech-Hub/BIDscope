/**
 * Fullscreen Manager - Centralized module for handling all fullscreen-related operations
 * 
 * This module manages the fullscreen state and coordinates between other components
 * to ensure consistent behavior and prevent conflicts.
 */

class FullscreenManager {
  constructor() {
    this.state = {
      isActive: false,
      isTransitioning: false,
      currentFrameId: null,
      scrollPosition: 0,
      debugMode: false
    };
    
    // Store for event subscribers
    this.subscribers = {
      beforeEnter: [],
      afterEnter: [],
      beforeExit: [],
      afterExit: [],
      error: []
    };
    
    // Debug logs
    this.logs = [];
    
    // Initialize when the module is created
    this.initialize();
  }
  
  /**
   * Initialize the fullscreen manager
   */
  initialize() {
    if (typeof window === 'undefined') return;
    
    // Make this accessible globally
    window.fullscreenManager = this;
    
    this.debug('Fullscreen Manager initialized');
    
    // Listen for escape key to exit fullscreen
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isActive) {
        this.debug('Escape key pressed, exiting fullscreen');
        this.exitFullscreen();
      }
    });
  }
  
  /**
   * Enable or disable debug mode
   */
  setDebugMode(enabled) {
    this.state.debugMode = enabled;
    this.debug(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    return this;
  }
  
  /**
   * Log a debug message if debug mode is enabled
   */
  debug(message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, data };
    
    this.logs.push(logEntry);
    
    // Keep logs under a reasonable size
    if (this.logs.length > 100) {
      this.logs.shift();
    }
    
    if (this.state.debugMode) {
      console.log(`[FullscreenManager] ${message}`, data || '');
    }
    
    return logEntry;
  }
  
  /**
   * Get the current fullscreen state
   */
  getState() {
    return { ...this.state };
  }
  
  /**
   * Subscribe to fullscreen events
   * @param {string} eventType - One of: 'beforeEnter', 'afterEnter', 'beforeExit', 'afterExit', 'error'
   * @param {Function} callback - The function to call when the event occurs
   */
  subscribe(eventType, callback) {
    if (!this.subscribers[eventType]) {
      this.debug(`Invalid event type: ${eventType}`);
      return false;
    }
    
    this.subscribers[eventType].push(callback);
    this.debug(`Subscribed to ${eventType} events`);
    return true;
  }
  
  /**
   * Unsubscribe from fullscreen events
   */
  unsubscribe(eventType, callback) {
    if (!this.subscribers[eventType]) return false;
    
    const initialCount = this.subscribers[eventType].length;
    this.subscribers[eventType] = this.subscribers[eventType].filter(cb => cb !== callback);
    
    const removed = initialCount - this.subscribers[eventType].length;
    if (removed > 0) {
      this.debug(`Unsubscribed ${removed} callbacks from ${eventType} events`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Emit an event to all subscribers
   */
  emit(eventType, data) {
    if (!this.subscribers[eventType]) return;
    
    this.debug(`Emitting ${eventType} event`, data);
    
    this.subscribers[eventType].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        this.debug(`Error in ${eventType} subscriber`, error);
      }
    });
  }
  
  /**
   * Enter fullscreen mode
   * @param {Object} options - Options for entering fullscreen
   * @param {HTMLElement} options.frame - The frame element to make fullscreen
   * @param {HTMLElement} options.button - The button that triggered fullscreen
   * @param {string} options.title - The title to display in the fullscreen header
   * @param {string} options.frameId - A unique identifier for this frame
   */
  enterFullscreen(options) {
    const { frame, button, title, frameId } = options;
    
    // Validate required params
    if (!frame || !frameId) {
      this.debug('Missing required parameters for enterFullscreen', options);
      this.emit('error', { message: 'Missing required parameters', options });
      return false;
    }
    
    // Prevent entering if already in fullscreen or transitioning
    if (this.state.isActive || this.state.isTransitioning) {
      this.debug('Already in fullscreen or transitioning, ignoring enterFullscreen call');
      return false;
    }
    
    try {
      // Update state
      this.state.isTransitioning = true;
      this.state.scrollPosition = window.scrollY;
      this.state.currentFrameId = frameId;
      
      this.debug('Entering fullscreen', { frameId, title });
      
      // Emit beforeEnter event
      this.emit('beforeEnter', { frame, button, title, frameId });
      
      // Create pointer event shield before anything else
      this.createPointerShield();
      
      // Create transition shield to block events during transition
      this.createTransitionShield();
      
      // Add body class
      document.body.classList.add('fullscreen-active');
      
      // Set up the fullscreen UI
      const { overlay, titleBar } = this.createFullscreenUI(title);
      
      // Use requestAnimationFrame for smoother rendering
      requestAnimationFrame(() => {
        // Make the frame fullscreen with strict isolation
        frame.classList.add('fullscreen');
        frame.setAttribute('data-fullscreen-id', frameId);
        
        // Apply strict isolation CSS
        this.applyStrictIsolation(frame);
        
        // Add the title bar to the frame
        frame.prepend(titleBar);
        
        // Update button icon if provided
        if (button) {
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"></path><path d="M21 8h-3a2 2 0 0 1-2-2V3"></path><path d="M3 16h3a2 2 0 0 1 2 2v3"></path><path d="M16 21v-3a2 2 0 0 1-2-2h3"></path></svg>';
        }
        
        // Set up event handlers for exiting
        this.setupExitHandlers(frame, button, titleBar, overlay);
        
        // Remove the transition shield after animation completes
        setTimeout(() => {
          this.removeTransitionShield();
          
          // Update state after transition
          this.state.isActive = true;
          this.state.isTransitioning = false;
          
          // Notify other modules about fullscreen state
          this.notifyOtherModules(true);
          
          // Emit afterEnter event
          this.emit('afterEnter', { frame, frameId });
          
          this.debug('Entered fullscreen mode successfully', { frameId });
        }, 300); // Match the CSS transition time
      });
      
      return true;
    } catch (error) {
      this.handleError('Error entering fullscreen', error);
      this.cleanupAfterError();
      return false;
    }
  }
  
  /**
   * Exit fullscreen mode
   * @param {Object} options - Optional parameters for exiting
   */
  exitFullscreen(options = {}) {
    // Find current fullscreen frame if not provided
    const frame = options.frame || document.querySelector('.viz-frame.fullscreen');
    if (!frame) {
      this.debug('No fullscreen frame found to exit');
      return false;
    }
    
    // Get associated button if not provided
    const button = options.button || frame.querySelector('.fullscreen-toggle');
    
    // Get frameId
    const frameId = frame.getAttribute('data-fullscreen-id') || this.state.currentFrameId;
    
    // Prevent exiting if already transitioning
    if (this.state.isTransitioning) {
      this.debug('Already transitioning, ignoring exitFullscreen call');
      return false;
    }
    
    try {
      // Update state
      this.state.isTransitioning = true;
      
      this.debug('Exiting fullscreen', { frameId });
      
      // Emit beforeExit event
      this.emit('beforeExit', { frame, button, frameId });
      
      // Create transition shield 
      this.createTransitionShield();
      
      // Find and remove the title bar
      const titleBar = frame.querySelector('.fullscreen-title');
      if (titleBar) {
        titleBar.remove();
      }
      
      // Find and remove the overlay
      const overlay = document.querySelector('.fullscreen-overlay');
      if (overlay) {
        overlay.remove();
      }
      
      // Use requestAnimationFrame for smoother rendering
      requestAnimationFrame(() => {
        // Remove strict isolation
        this.removeStrictIsolation(frame);
        
        // Remove fullscreen class
        frame.classList.remove('fullscreen');
        frame.removeAttribute('data-fullscreen-id');
        
        // Remove body class
        document.body.classList.remove('fullscreen-active');
        
        // Restore scroll position
        window.scrollTo(0, this.state.scrollPosition);
        
        // Update button icon if provided
        if (button) {
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"></path><path d="M21 8V5a2 2 0 0 0-2-2h-3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path><path d="M16 21h3a2 2 0 0 0 2-2v-3"></path></svg>';
        }
        
        // Allow time for the UI to update before removing the shield
        setTimeout(() => {
          this.removePointerShield();
          this.removeTransitionShield();
          
          // Update state after transition
          this.state.isActive = false;
          this.state.isTransitioning = false;
          this.state.currentFrameId = null;
          
          // Notify other modules about fullscreen state change
          this.notifyOtherModules(false);
          
          // Emit afterExit event
          this.emit('afterExit', { frameId });
          
          this.debug('Exited fullscreen mode successfully');
        }, 300); // Match the CSS transition time
      });
      
      return true;
    } catch (error) {
      this.handleError('Error exiting fullscreen', error);
      this.cleanupAfterError();
      return false;
    }
  }
  
  /**
   * Create the fullscreen UI elements (overlay and title bar)
   */
  createFullscreenUI(title) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.classList.add('fullscreen-overlay');
    document.body.appendChild(overlay);
    
    // Create title bar with close button
    const titleBar = document.createElement('div');
    titleBar.classList.add('fullscreen-title');
    titleBar.innerHTML = `
      <h3>${title || 'Fullscreen View'}</h3>
      <button class="fullscreen-close" aria-label="Close fullscreen">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    
    return { overlay, titleBar };
  }
  
  /**
   * Set up event handlers for exiting fullscreen
   */
  setupExitHandlers(frame, button, titleBar, overlay) {
    // Handle close button click
    const closeButton = titleBar.querySelector('.fullscreen-close');
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.exitFullscreen({ frame, button });
      });
    }
    
    // Handle overlay click
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.exitFullscreen({ frame, button });
      });
    }
  }
  
  /* NEW STRICT ISOLATION METHODS */
  
  // Creates a shield to block ALL pointer events
  createPointerShield() {
    // Remove any existing shield first
    this.removePointerShield();
    
    // Create the shield that sits under the fullscreen element but above everything else
    const shield = document.createElement('div');
    shield.id = 'fullscreen-pointer-shield';
    shield.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 9990 !important;
      background-color: transparent !important;
      pointer-events: auto !important;
      cursor: default !important;
    `;
    
    document.body.appendChild(shield);
    this.debug('Pointer shield created');
    
    // Also add a special class to the html element to help with isolation
    document.documentElement.classList.add('fullscreen-active-html');
    
    // Add event listeners to prevent any bubbling
    shield.addEventListener('mousemove', e => e.stopPropagation());
    shield.addEventListener('mouseenter', e => e.stopPropagation());
    shield.addEventListener('mouseleave', e => e.stopPropagation());
    shield.addEventListener('mouseout', e => e.stopPropagation());
    shield.addEventListener('mouseover', e => e.stopPropagation());
  }
  
  removePointerShield() {
    const shield = document.getElementById('fullscreen-pointer-shield');
    if (shield) {
      shield.remove();
      this.debug('Pointer shield removed');
    }
    document.documentElement.classList.remove('fullscreen-active-html');
  }
  
  // Apply strict isolation to the fullscreen frame
  applyStrictIsolation(frame) {
    // Use inline CSS for absolute priority
    const isolationStyles = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      max-width: 100vw !important;
      max-height: 100vh !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      outline: none !important;
      z-index: 10000 !important;
      background-color: white !important;
      isolation: isolate !important;
      contain: layout size paint style !important;
      pointer-events: auto !important;
      touch-action: none !important;
      -webkit-overflow-scrolling: touch !important;
      overscroll-behavior: contain !important;
      overflow: hidden !important;
      transform: translateZ(0) !important;
      -webkit-transform: translateZ(0) !important;
      -webkit-font-smoothing: antialiased !important;
    `;
    
    frame.style.cssText += isolationStyles;
    
    // Also add a data attribute for extra selector strength
    frame.dataset.fsIsolated = "true";
    
    // Force the parent containers to behave
    let parent = frame.parentElement;
    while (parent && parent !== document.body) {
      parent.style.overflow = 'visible !important';
      parent = parent.parentElement;
    }
  }
  
  removeStrictIsolation(frame) {
    // Remove inline isolation styles
    frame.style.cssText = ''; // Reset all inline styles
    frame.removeAttribute('data-fs-isolated');
  }
  
  /**
   * Create a transition shield to block events during transition
   */
  createTransitionShield() {
    // Remove any existing shield first
    this.removeTransitionShield();
    
    // Create a new shield
    const shield = document.createElement('div');
    shield.id = 'fullscreen-transition-shield';
    shield.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:15000;background:transparent;pointer-events:auto;cursor:wait;';
    document.body.appendChild(shield);
    
    this.debug('Transition shield created');
  }
  
  /**
   * Remove the transition shield
   */
  removeTransitionShield() {
    const shield = document.getElementById('fullscreen-transition-shield');
    if (shield) {
      shield.remove();
      this.debug('Transition shield removed');
    }
  }
  
  /**
   * Notify other modules about fullscreen state changes
   */
  notifyOtherModules(isEntering) {
    try {
      // Notify MapCleanupManager
      if (window.mapCleanupManager) {
        window.mapCleanupManager.isFullscreenActive = isEntering;
        this.debug(`Notified MapCleanupManager: isFullscreenActive = ${isEntering}`);
      }
      
      // Notify MapEventManager
      if (window.MapEventManager) {
        window.MapEventManager.isFullscreenActive = isEntering;
        this.debug(`Notified MapEventManager: isFullscreenActive = ${isEntering}`);
      }
      
      // Add other modules here as needed
    } catch (error) {
      this.debug('Error notifying other modules', error);
    }
  }
  
  /**
   * Handle errors that occur during fullscreen operations
   */
  handleError(message, error) {
    this.debug(message, error);
    console.error(`[FullscreenManager] ${message}:`, error);
    
    // Emit error event
    this.emit('error', { message, error });
  }
  
  /**
   * Clean up state after an error
   */
  cleanupAfterError() {
    // Remove pointer shield
    this.removePointerShield();
    
    // Remove transition shield
    this.removeTransitionShield();
    
    // Remove fullscreen classes
    document.body.classList.remove('fullscreen-active');
    document.documentElement.classList.remove('fullscreen-active-html');
    
    // Reset state
    this.state.isActive = false;
    this.state.isTransitioning = false;
    this.state.currentFrameId = null;
    
    // Notify other modules
    this.notifyOtherModules(false);
    
    // Find and clean up any lingering fullscreen elements
    const fullscreenFrames = document.querySelectorAll('.fullscreen');
    fullscreenFrames.forEach(frame => {
      this.removeStrictIsolation(frame);
      frame.classList.remove('fullscreen');
    });
    
    const overlays = document.querySelectorAll('.fullscreen-overlay');
    overlays.forEach(overlay => {
      overlay.remove();
    });
    
    const titleBars = document.querySelectorAll('.fullscreen-title');
    titleBars.forEach(titleBar => {
      titleBar.remove();
    });
    
    this.debug('Cleaned up after error');
  }
}

// Create singleton instance
const fullscreenManager = new FullscreenManager();

// Export singleton
export default fullscreenManager;
