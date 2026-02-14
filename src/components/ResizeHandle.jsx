import React, { useState, useEffect } from 'react';
import './ResizeHandle.css';

const ResizeHandle = ({ onResize, isDragging, setIsDragging, orientation = 'vertical' }) => {
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState(0);

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
      handleResize(touch.clientX, touch.clientY);
    };

    const handleResize = (clientX, clientY) => {
      const container = document.querySelector('.resize-container');
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      
      if (orientation === 'vertical') {
        let newSize;
        // Check if we're in mobile/tablet layout (column direction)
        if (window.innerWidth <= 1024) {
          // Vertical resize for mobile/tablet
          newSize = ((clientY - containerRect.top) / containerRect.height) * 100;
          newSize = Math.min(Math.max(newSize, 30), 70);
        } else {
          // Horizontal resize for desktop
          newSize = ((clientX - containerRect.left) / containerRect.width) * 100;
          newSize = Math.min(Math.max(newSize, 30), 70);
        }
        onResize(e, newSize);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      document.addEventListener('touchcancel', handleMouseUp);
      
      // Set cursor based on orientation and screen size
      if (window.innerWidth <= 1024) {
        document.body.style.cursor = 'row-resize';
      } else {
        document.body.style.cursor = 'col-resize';
      }
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('touchcancel', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging, onResize, orientation]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setInitialPos({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    setInitialPos({ x: touch.clientX, y: touch.clientY });
  };

  // Determine orientation class based on screen size
  const getOrientationClass = () => {
    if (window.innerWidth <= 768) {
      return 'horizontal'; // Mobile - stack vertically
    } else if (window.innerWidth <= 1024) {
      return 'both'; // iPad - can resize both directions
    }
    return orientation; // Laptop - vertical
  };

  return (
    <div 
      className={`resize-handle ${getOrientationClass()} ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="handle-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      {window.innerWidth <= 1024 && (
        <div className="handle-label">
          ⋮⋮
        </div>
      )}
    </div>
  );
};

export default ResizeHandle;