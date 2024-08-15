import { useEffect, useState } from 'react';
import { Platform } from 'react-native';


/**
 * カスタムフック - useHorizontalScroll
 * 
 * このフックは、スクロール可能な領域にマウスがホバーしているときに、縦スクロールを横スクロールに変換するためのものです。
 * Webプラットフォーム専用です。
 *
 * @param {React.RefObject} scrollViewRef - スクロール対象のスクロールビューの参照
 * @returns {Object} - `onMouseEnter` と `onMouseLeave` イベントハンドラ
 */
const useHorizontalScroll = (scrollViewRef) => {
  // スクロール領域にマウスがホバーしているかどうかを管理する状態
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Webプラットフォーム以外ではこのフックは動作しない
    if (Platform.OS !== 'web') return;

    /**
     * スクロールイベントハンドラ
     * 
     * マウスのホイールイベントに基づいてスクロール動作を制御します。
     * 縦スクロールの代わりに横スクロールを行うために使用します。
     * 
     * @param {WheelEvent} event - マウスのホイールイベント
    */
    const handleWheel = (event) => {
      if (scrollViewRef.current) {
        // 縦スクロール（deltaY）と横スクロール（deltaX）を判定
        if (isHovered) {
          // ページ全体のスクロールが行われることを防ぐため、
          // ページ全体のスクロールを無効にする
          event.preventDefault();

          if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            // 横スクロールのケース
            scrollViewRef.current.scrollTo({
              x: scrollViewRef.current.scrollLeft + event.deltaX,
              animated: false,
            });
          } else {
            // 縦スクロールのケース
            // 縦スクロールを横スクロールに変換する
            scrollViewRef.current.scrollTo({
              x: scrollViewRef.current.scrollLeft + event.deltaY,
              animated: false,
            });
          }
        }
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
