import { useState, useEffect } from 'react';

/**
 * Custom React hook to detect if the user is on a mobile device
 * @param {number} breakpoint - The screen width threshold in pixels (default: 768)
 * @returns {boolean} - Returns true if the screen width is below the breakpoint
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window === 'undefined') return;

    // Function to check screen width
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
