import { useRef, useCallback } from 'react';

/**
 * Custom hook for handling long press interactions on map
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Duration for long press in milliseconds
 * @param {number} options.animationDuration - Duration for animation in milliseconds
 * @param {Function} options.onComplete - Callback when long press completes
 * @param {string} options.tooltipId - ID of the tooltip element
 * @param {Array} options.validItems - Array of items valid for long press
 * @returns {Object} Long press handlers
 */
export function useLongPress({
  duration = 800,
  animationDuration = 700,
  onComplete,
  tooltipId,
  validItems = []
}) {
  // State references
  const longPressTimer = useRef(null);
  const animationFrame = useRef(null);
  const currentItem = useRef(null);
  const isLongPressing = useRef(false);
  const longPressProgress = useRef(0);
  const lastAnimationTime = useRef(0);
  const isMounted = useRef(true);

  // Cancel any ongoing long press
  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    
    isLongPressing.current = false;
    longPressProgress.current = 0;
    lastAnimationTime.current = 0;
    currentItem.current = null;
    
    // Reset tooltip styling if tooltip exists
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
      tooltip.style.transform = 'translate(-50%, -100%)';
      tooltip.style.opacity = '1';
      tooltip.style.boxShadow = '';
      
      const tooltipContent = tooltip.querySelector('.tooltip-content');
      if (tooltipContent) {
        tooltipContent.style.backgroundColor = '';
        tooltipContent.style.border = '';
        
        // Remove progress elements if they exist
        const progressContainer = tooltipContent.querySelector('.tooltip-progress-container');
        const progressText = tooltipContent.querySelector('[style*="font-size:13px"]');
        
        if (progressContainer) {
          progressContainer.remove();
        }
        
        if (progressText) {
          progressText.remove();
        }
      }
    }
  }, [tooltipId]);

  // Start the long press animation
  const animateLongPress = useCallback((timestamp) => {
    if (!isLongPressing.current || !isMounted.current) return;
    
    if (!lastAnimationTime.current) lastAnimationTime.current = timestamp;
    const elapsed = timestamp - lastAnimationTime.current;
    
    // Update progress based on elapsed time
    longPressProgress.current = Math.min(1, longPressProgress.current + (elapsed / animationDuration));
    lastAnimationTime.current = timestamp;
    
    // Get tooltip element
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
      // Find progress bar
      const progressBar = tooltip.querySelector('.tooltip-progress');
      if (progressBar) {
        // Update width with fixed pixel values for better browser support
        const progressWidth = Math.round(longPressProgress.current * 100);
        progressBar.style.width = `${progressWidth}%`;
      }
      
      // Animate tooltip
      const scale = 1 + (longPressProgress.current * 0.1);
      tooltip.style.transform = `translate(-50%, -100%) scale(${scale})`;
      tooltip.style.opacity = '1';
    }
    
    // If complete, trigger callback
    if (longPressProgress.current >= 1) {
      isLongPressing.current = false;
      
      // Stop animation frame before callback to prevent errors
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      
      // Trigger completion callback
      if (currentItem.current && onComplete) {
        onComplete(currentItem.current);
      }
      
      return;
    }
    
    // Continue animation if not complete
    if (isLongPressing.current && isMounted.current) {
      animationFrame.current = requestAnimationFrame(animateLongPress);
    }
  }, [animationDuration, tooltipId, onComplete]);

  // Start the long press interaction
  const startLongPress = useCallback((itemName) => {
    // Only allow long press for valid items
    const isValid = validItems.includes(itemName);
    if (!isValid) return;
    
    // Clear any existing timers
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    // Set up new long press timer
    currentItem.current = itemName;
    longPressTimer.current = setTimeout(() => {
      // Find the tooltip and set up progress bar
      const tooltip = document.getElementById(tooltipId);
      if (!tooltip) {
        console.warn(`Tooltip not found: ${tooltipId}`);
        return;
      }
      
      // Clear any existing progress elements
      const existingProgress = tooltip.querySelector('.tooltip-progress-container');
      if (existingProgress) {
        existingProgress.remove();
      }
      
      // Apply base styling to tooltip
      tooltip.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
      tooltip.style.transform = 'translate(-50%, -100%) scale(1)';
      tooltip.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)';
      
      // Find tooltip content
      const tooltipContent = tooltip.querySelector('.tooltip-content');
      if (!tooltipContent) {
        console.warn('Tooltip content not found');
        return;
      }
      
      // Create progress bar container
      const progressContainer = document.createElement('div');
      progressContainer.className = 'tooltip-progress-container';
      progressContainer.style.cssText = 'width:100%;height:6px;background:#e5e7eb;margin-top:8px;border-radius:3px;overflow:hidden;';
      
      // Create progress bar
      const progressBar = document.createElement('div');
      progressBar.className = 'tooltip-progress';
      progressBar.style.cssText = 'height:100%;width:0%;background:#10B981;';
      progressContainer.appendChild(progressBar);
      
      // Create text indicator
      const progressText = document.createElement('div');
      progressText.style.cssText = 'font-size:13px;font-weight:500;color:#10B981;text-align:center;margin-top:6px;';
      progressText.textContent = 'Continue holding to view project';
      
      // Add to tooltip
      tooltipContent.appendChild(progressContainer);
      tooltipContent.appendChild(progressText);
      
      // Style tooltip content
      tooltipContent.style.backgroundColor = 'rgba(240, 253, 250, 0.8)';
      tooltipContent.style.border = '1px solid rgba(16, 185, 129, 0.3)';
      
      // Start animation
      isLongPressing.current = true;
      longPressProgress.current = 0;
      lastAnimationTime.current = 0;
      animationFrame.current = requestAnimationFrame(animateLongPress);
      
    }, duration);
  }, [tooltipId, duration, validItems, animateLongPress]);

  // Cleanup function
  const cleanup = useCallback(() => {
    isMounted.current = false;
    cancelLongPress();
  }, [cancelLongPress]);

  return {
    startLongPress,
    cancelLongPress,
    cleanup
  };
}

export default useLongPress;
