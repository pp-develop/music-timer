import { Animated } from 'react-native';
import { router } from 'expo-router';
import { getErrorMessageKey } from '../../../types/errorCodes';
import { t } from '../../../locales/i18n';
import { ERROR_MESSAGE_DISPLAY_DURATION } from '../../../config';

/**
 * フォームのエラー処理フック
 *
 * エラー表示のライフサイクル管理:
 * 1. showError(): エラーを表示し、ERROR_MESSAGE_DISPLAY_DURATION後にフェードアウト
 * 2. dismissError(): エラーを閉じる
 * 3. handleHttpError(): HTTPステータスに応じてページ遷移
 */
export const useFormErrorHandling = (
    failureOpacity: Animated.Value,
    setErrorMessage: (msg: string) => void,
    setCreationStatus: (status: 'idle' | 'success' | 'failure') => void
) => {
    let timeoutId: NodeJS.Timeout | null = null;

    /**
     * エラーを表示
     * ERROR_MESSAGE_DISPLAY_DURATION後に自動でフェードアウト
     */
    const showError = (errorCode?: string) => {
        const errorKey = getErrorMessageKey(errorCode);
        setErrorMessage(t(errorKey));
        setCreationStatus('failure');
        Animated.timing(failureOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            timeoutId = setTimeout(() => {
                dismissError();
            }, ERROR_MESSAGE_DISPLAY_DURATION);
        });
    };

    /**
     * エラーを閉じる
     */
    const dismissError = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        Animated.timing(failureOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            setCreationStatus('idle');
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
        dismissError,
    };
};
