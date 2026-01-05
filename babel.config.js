module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@features': './src/features',
          '@shared': './src/shared',
          '@navigation': './src/navigation',
          '@store': './src/store',
          '@services': './src/services',
          '@theme': './src/theme',
          '@assets': './src/assets',
        },
      },
      'react-native-worklets/plugin',
    ],

  ],
};