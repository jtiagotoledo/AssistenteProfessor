import * as Keychain from 'react-native-keychain';

export const salvarTokens = async (accessToken: string, refreshToken: string) => {
  try {
    const tokensString = JSON.stringify({ accessToken, refreshToken });
    await Keychain.setGenericPassword('tokens', tokensString);
  } catch (error) {
    console.error('Erro ao salvar tokens', error);
  }
};

export const recuperarTokens = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return JSON.parse(credentials.password); // { accessToken, refreshToken }
    }
    return null;
  } catch (error) {
    console.error('Erro ao recuperar tokens', error);
    return null;
  }
};

export const limparTokens = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Erro ao limpar tokens', error);
  }
};
