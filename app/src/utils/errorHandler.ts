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
 *
 * 認証エラー（401）のリダイレクトは以下のフローで処理される:
 * 1. axos.ts で clearTokens() が呼ばれる
 * 2. tokenManager.ts が auth:cleared イベントを発行
 * 3. useSpotifyAuth がイベントを受け取り isAuthenticated=false に更新
 * 4. _layout.tsx が isAuthenticated の変更を検知してリダイレクト
 */
export const handleApiError = (error: any) => {
  const status = error?.response?.status || error?.httpStatus;

  // 認証エラー（303, 401）は axos.ts → tokenManager → useSpotifyAuth → _layout.tsx で処理
  // ここでは何もしない（イベントベースで処理される）
  if (status === 303 || status === 401) {
    return;
  }

  // リトライ完了後のエラー → エラー画面へ
  if (isRetryExhausted(error)) {
    router.replace("/error");
    return;
  }

  // まだリトライ中 → 何もしない（axios-retryが処理）
};
