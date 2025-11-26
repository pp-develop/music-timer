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
 *
 * @example
 * ```typescript
 * catch (error: any) {
 *   handleApiError(error);
 * }
 * ```
 */
export const handleApiError = (error: any) => {
  const status = error?.response?.status || error?.httpStatus;

  // 認証エラー（303, 401）→ ホームへ
  // router.replace("/")でホームに戻ると、useAuthが再実行され、
  // 認証チェックAPIが呼ばれて自動的にisAuthenticated=falseになる
  if (status === 303 || status === 401) {
    router.replace("/");
    return;
  }

  // リトライ完了後のエラー → エラー画面へ
  if (isRetryExhausted(error)) {
    router.replace("/error");
    return;
  }

  // まだリトライ中 → 何もしない（axios-retryが処理）
};
