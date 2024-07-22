import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Platform } from 'react-native';

const useHorizontalScroll = (scrollViewRef) => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleWheel = (event) => {
      if (scrollViewRef.current) {
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
  }, [scrollViewRef]);
};

export default useHorizontalScroll;
