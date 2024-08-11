import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const useHorizontalScroll = (scrollViewRef) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleWheel = (event) => {
      if (isHovered && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: scrollViewRef.current.scrollLeft + event.deltaY,
          animated: false,
        });
      }
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [scrollViewRef, isHovered]);

  return { onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false) };
};

export default useHorizontalScroll;
