import { Animated } from 'react-native';
import { router } from 'expo-router';
import { getErrorMessageKey } from '../../../types/errorCodes';
import { t } from '../../../locales/i18n';
import { ERROR_MESSAGE_DISPLAY_DURATION } from '../../../config';

/**
 * フォームのエラー処理フック
 */
export const useFormErrorHandling = (
    failureOpacity: Animated.Value,
    setErrorMessage: (msg: string) => void,
    setCreationStatus: (status: 'idle' | 'success' | 'failure') => void
) => {
    // エラー表示の共通関数
    const showError = (errorCode?: string) => {
        const errorKey = getErrorMessageKey(errorCode);
        setErrorMessage(t(errorKey));
        setCreationStatus('failure');
        Animated.timing(failureOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            setTimeout(() => {
                Animated.timing(failureOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }).start(() => {
                    setCreationStatus('idle');
                });
            }, ERROR_MESSAGE_DISPLAY_DURATION);
        });
    };

    // HTTPエラーハンドリング
    const handleHttpError = (httpStatus: number) => {
        if (httpStatus === 303 || httpStatus === 401) {
            router.replace("/");
        } else if (httpStatus >= 500 && httpStatus < 600 || !httpStatus) {
            router.replace("/error");
        }
    };

    return {
        showError,
        handleHttpError,
    };
};
