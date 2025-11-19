import React from 'react';
import { CustomToast } from './index';

/**
 * react-native-toast-messageのカスタム設定
 *
 * 使用方法:
 * - success: Toast.show({ type: 'success', text1: 'タイトル', text2: 'サブテキスト' })
 * - error: Toast.show({ type: 'error', text1: 'タイトル', text2: 'サブテキスト' })
 * - info: Toast.show({ type: 'info', text1: 'タイトル', text2: 'サブテキスト' })
 */
export const toastConfig = {
    /**
     * 成功トースト（緑のグロー + チェックマーク）
     */
    success: (props: any) => <CustomToast {...props} type="success" />,

    /**
     * エラートースト（赤のグロー + 感嘆符）
     */
    error: (props: any) => <CustomToast {...props} type="error" />,

    /**
     * 情報トースト（青のグロー + スピナー）
     */
    info: (props: any) => <CustomToast {...props} type="info" />,
};
