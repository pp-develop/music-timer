const { withAndroidManifest, withDangerousMod, AndroidConfig } = require('@expo/config-plugins');
const { existsSync, mkdirSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const NETWORK_SECURITY_CONFIG_XML = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <!-- システム証明書を信頼 -->
            <certificates src="system" />
            <!-- ユーザーがインストールした証明書を信頼（mkcert用） -->
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>
`;

/**
 * ユーザーがインストールした証明書を信頼するための network_security_config を追加
 * Development Build で自己署名証明書（mkcert）を使用する場合に必要
 */
const withNetworkSecurityConfig = (config) => {
  // Step 1: network_security_config.xml ファイルを作成
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const xmlDir = resolve(config.modRequest.platformProjectRoot, 'app/src/main/res/xml');
      const xmlPath = resolve(xmlDir, 'network_security_config.xml');

      if (!existsSync(xmlDir)) {
        mkdirSync(xmlDir, { recursive: true });
      }

      writeFileSync(xmlPath, NETWORK_SECURITY_CONFIG_XML);
      console.log('Created network_security_config.xml');

      return config;
    },
  ]);

  // Step 2: AndroidManifest.xml に参照を追加
  config = withAndroidManifest(config, async (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    mainApplication.$['android:networkSecurityConfig'] = '@xml/network_security_config';
    return config;
  });

  return config;
};

module.exports = withNetworkSecurityConfig;
