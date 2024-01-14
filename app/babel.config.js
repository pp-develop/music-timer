module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      'expo-router/babel',
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
          safe: true
        }
      ]
    ],
    presets: ['babel-preset-expo'],
  };
};
