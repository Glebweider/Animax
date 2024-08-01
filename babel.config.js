module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo'  // This is a preset
    ],
    plugins: [
      '@babel/plugin-transform-class-static-block', // This is a plugin
      'react-native-reanimated/plugin',
      ["module-resolver", {
        "alias": {
          "@Components": "./src/components",
          "@Modal": "./src/components/modals",
          "@Icons": "./src/components/icons",
          "@Utils": "./src/utils",
          "@Stack": "./src/screens/Stack",
          "@Tab": "./src/screens/Tab",
          "@Redux": "./src/redux",
          "@Assets": "./assets",
          "@Interfaces": './src/interfaces'
        },
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
        ]
      }],
    ],
  };
};