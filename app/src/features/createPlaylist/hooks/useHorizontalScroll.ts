import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const useHorizontalScroll = (scrollViewRef) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleWheel = (event) => {
      if (isHovered && scrollViewRef.current) {
        // ページ全体のスクロールを無効にする
        event.preventDefault();

        // 横スクロールを実行する
        scrollViewRef.current.scrollTo({
          x: scrollViewRef.current.scrollLeft + event.deltaY,
          animated: false,
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [scrollViewRef, isHovered]);

  return { onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false) };
};

export default useHorizontalScroll;
