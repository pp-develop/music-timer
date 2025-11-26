import { router } from 'expo-router';

/**
 * axios-retryの最大リトライ回数
 * axos.tsのretries設定と一致させること
 */
export const MAX_RETRIES = 3;

/**
 * リトライが完了したエラーかチェック
 */
export const isRetryExhausted = (error: any): boolean => {
  const retryCount = error?.config?.['axios-retry']?.retryCount || 0;
  return retryCount >= MAX_RETRIES;
};

/**
 * APIエラーを処理してナビゲーション
 *
 * @param error - Axiosエラーオブジェクト
 * @param options - コールバックオプション
 * @param options.onAuthError - 認証エラー時のコールバック
 * @param options.onServerError - サーバーエラー時のコールバック
 *
 * @example
 * ```typescript
 * catch (error: any) {
 *   handleApiError(error, {
 *     onAuthError: () => setAuthState(false),
 *     onServerError: () => console.error('Failed:', error)
 *   });
 * }
 * ```
 */
export const handleApiError = (error: any, options?: {
  onAuthError?: () => void;
  onServerError?: () => void;
}) => {
  const status = error?.response?.status || error?.httpStatus;

  // 認証エラー（303, 401）→ ホームへ
  if (status === 303 || status === 401) {
    options?.onAuthError?.();
    router.replace("/");
    return;
  }

  // リトライ完了後のエラー → エラー画面へ
  if (isRetryExhausted(error)) {
    options?.onServerError?.();
    router.replace("/error");
    return;
  }

  // まだリトライ中 → 何もしない（axios-retryが処理）
};
