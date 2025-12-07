import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { saveTokens, TokenPair, ServiceType } from '../utils/tokenManager';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth';
import { useSoundCloudAuth } from '../hooks/useSoundCloudAuth';

export default function AuthCallbackPage() {
  // URLパラメータまたはフラグメントから直接トークンを取得
  const { service, access_token, refresh_token, expires_in, error } = useLocalSearchParams();
  const [status, setStatus] = useState<string>('処理中...');
  const { setAuthState: setSpotifyAuthState } = useSpotifyAuth();
  const { setAuthState: setSoundCloudAuthState } = useSoundCloudAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Web版の場合はこのページを使用しない
      if (Platform.OS === 'web') {
        router.replace('/');
        return;
      }

      if (error) {
        console.error('Authentication error:', error);
        setStatus(`認証エラーが発生しました: ${error}`);
        setTimeout(() => router.replace('/'), 2000);
        return;
      }

      if (!access_token || !refresh_token || !expires_in) {
        console.error('Missing tokens:', { access_token, refresh_token, expires_in });
        setStatus('認証情報が見つかりません');
        setTimeout(() => router.replace('/'), 2000);
        return;
      }

      try {
        // サービスを判定（デフォルトはspotify）
        const serviceType: ServiceType = (Array.isArray(service) ? service[0] : service || 'spotify') as ServiceType;

        // トークンをSecureStoreに保存
        const tokenPair: TokenPair = {
          access_token: Array.isArray(access_token) ? access_token[0] : access_token,
          refresh_token: Array.isArray(refresh_token) ? refresh_token[0] : refresh_token,
          expires_in: parseInt(Array.isArray(expires_in) ? expires_in[0] : expires_in, 10),
          token_type: 'Bearer',
        };

        await saveTokens(tokenPair, serviceType);

        setStatus('認証成功！');

        // サービスごとに認証状態を更新
        if (serviceType === 'spotify') {
          setSpotifyAuthState(true);
        } else if (serviceType === 'soundcloud') {
          setSoundCloudAuthState(true);
        }

        // プレイリスト画面にリダイレクト
        setTimeout(() => router.replace(`/${serviceType}/playlist`), 500);
      } catch (error) {
        console.error('Token save failed:', error);
        setStatus('トークン保存に失敗しました');
        setTimeout(() => router.replace('/'), 2000);
      }
    };

    handleCallback();
  }, [access_token, refresh_token, expires_in, error]);

  const serviceType = (Array.isArray(service) ? service[0] : service || 'spotify') as ServiceType;
  const indicatorColor = serviceType === 'soundcloud' ? '#FF5500' : '#1DB954';

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={indicatorColor} />
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e2124',
  },
  text: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
  },
});
