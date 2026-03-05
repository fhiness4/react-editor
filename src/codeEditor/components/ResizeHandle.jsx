import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ResizeHandle.css';

const ResizeHandle = ({ 
  onResize, 
  isDragging, 
  setIsDragging, 
  orientation = 'vertical',
  minSize = 30,
  maxSize = 70,
  containerSelector = '.resize-container'
}) => {
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState(0);
  const handleRef = useRef(null);
  
  // Determine orientation based on screen size
  const getEffectiveOrientation = useCallback(() => {
    if (window.innerWidth <= 768) {
      return 'horizontal'; // Mobile - horizontal resize (top/bottom)
    } else if (window.innerWidth <= 1024) {
      return orientation; // Tablet - respect passed orientation
    }
    return orientation; // Desktop - respect passed orientation
  }, [orientation]);

  const handleResize = useCallback((clientX, clientY) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const effectiveOrientation = getEffectiveOrientation();
    let newSize;
    let delta;
    
    if (effectiveOrientation === 'vertical') {
      // Horizontal resize (left/right) - calculate based on mouse movement
      delta = clientX - initialPos.x;
      // Convert delta to percentage based on container width
      delta = (delta / containerRect.width) * 100;
      // Apply delta to initial size
      newSize = initialSize + delta;
    } else {
      // Vertical resize (top/bottom) - calculate based on mouse movement
      delta = clientY - initialPos.y;
      // Convert delta to percentage based on container height
      delta = (delta / containerRect.height) * 100;
      // Apply delta to initial size
      newSize = initialSize + delta;
    }
    
    newSize = Math.min(Math.max(newSize, minSize), maxSize);
    
    if (onResize) {
      onResize({ 
        clientX, 
        clientY, 
        size: newSize,
        orientation: effectiveOrientation,
        delta
      });
    }
  }, [onResize, getEffectiveOrientation, containerSelector, minSize, maxSize, initialPos, initialSize]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      handleResize(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleResize(touch.clientX, touch.clientY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      document.body.style.pointerEvents = 'auto';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      document.addEventListener('touchcancel', handleMouseUp);
      
      // Set cursor based on effective orientation
      const effectiveOrientation = getEffectiveOrientation();
      document.body.style.cursor = effectiveOrientation === 'vertical' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
      document.body.style.pointerEvents = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('touchcancel', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      document.body.style.pointerEvents = 'auto';
    };
  }, [isDragging, handleResize, getEffectiveOrientation, setIsDragging]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const container = document.querySelector(containerSelector);
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const effectiveOrientation = getEffectiveOrientation();
      
      // Store initial size as percentage based on current container size
      if (effectiveOrientation === 'vertical') {
        // For vertical orientation, size is width percentage
        const currentSize = (containerRect.width / container.parentElement.getBoundingClientRect().width) * 100;
        setInitialSize(currentSize);
      } else {
        // For horizontal orientation, size is height percentage
        const currentSize = (containerRect.height / container.parentElement.getBoundingClientRect().height) * 100;
        setInitialSize(currentSize);
      }
    }
    
    setInitialPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const container = document.querySelector(containerSelector);
    if (container && e.touches[0]) {
      const containerRect = container.getBoundingClientRect();
      const effectiveOrientation = getEffectiveOrientation();
      
      if (effectiveOrientation === 'vertical') {
        const currentSize = (containerRect.width / container.parentElement.getBoundingClientRect().width) * 100;
        setInitialSize(currentSize);
      } else {
        const currentSize = (containerRect.height / container.parentElement.getBoundingClientRect().height) * 100;
        setInitialSize(currentSize);
      }
    }
    
    const touch = e.touches[0];
    if (touch) {
      setInitialPos({ x: touch.clientX, y: touch.clientY });
      setIsDragging(true);
    }
  };

  // Get orientation class for styling
  const getOrientationClass = useCallback(() => {
    if (window.innerWidth <= 768) {
      return 'mobile-horizontal';
    } else if (window.innerWidth <= 1024) {
      return 'tablet-' + orientation;
    }
    return orientation;
  }, [orientation]);

  return (
    <div 
      ref={handleRef}
      className={`resize-handle ${getOrientationClass()} ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="separator"
      aria-orientation={getEffectiveOrientation()}
      aria-valuemin={minSize}
      aria-valuemax={maxSize}
      tabIndex={9}
    >
      <div className="handle-indicator" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      {/* Show resize icon for tablet/mobile */}
      {window.innerWidth <= 1024 && (
        <div className="handle-label" aria-hidden="true">
          {window.innerWidth <= 768 ? '↕️' : '↔️'}
        </div>
      )}
    </div>
  );
};

export default ResizeHandle;