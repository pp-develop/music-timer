import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import ReactGA from 'react-ga4';
import { GOOGLE_ANALYTICS_TRACKING_ID } from '../config';

// Web版のみGoogle Analyticsを初期化
if (Platform.OS === 'web' && GOOGLE_ANALYTICS_TRACKING_ID) {
    ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_ID);
}

const usePageViewTracking = (): void => {
    const { pathname } = useRouter();

    useEffect(() => {
        // Web版のみページビューを送信
        if (Platform.OS === 'web' && pathname && GOOGLE_ANALYTICS_TRACKING_ID) {
            ReactGA.send({ hitType: 'pageview', page: pathname });
        }
    }, [pathname]);
};

export default usePageViewTracking;
