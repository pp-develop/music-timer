/**
 * Header コンポーネント
 *
 * パスに基づいて適切なサービス固有のHeaderを表示します。
 * これにより、不要な認証hookの呼び出しを避けます。
 */

import React from "react";
import { usePathname } from 'expo-router';
import { SpotifyHeader } from './SpotifyHeader';
import { SoundCloudHeader } from './SoundCloudHeader';

export const Header = () => {
    const pathname = usePathname();

    // エラーページではHeaderを表示しない
    if (pathname === '/error') {
        return null;
    }

    // パスに基づいてサービス固有のHeaderを表示
    if (pathname.startsWith('/spotify')) {
        return <SpotifyHeader />;
    }

    if (pathname.startsWith('/soundcloud')) {
        return <SoundCloudHeader />;
    }

    // ホーム画面やその他のページではHeaderを表示しない
    return null;
};