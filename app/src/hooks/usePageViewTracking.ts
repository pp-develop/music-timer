import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import ReactGA from 'react-ga4';
import { GOOGLE_ANALYTICS_TRACKING_ID } from '../config';

ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_ID);

const usePageViewTracking = (): void => {
    const { pathname } = useRouter();

    useEffect(() => {
        if (pathname) {
            ReactGA.send({ hitType: 'pageview', page: pathname });
        }
    }, [pathname]);
};

export default usePageViewTracking;
