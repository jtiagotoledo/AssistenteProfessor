module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    '@react-native',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', 
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};