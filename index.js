import {AppRegistry} from 'react-native';
import Rotas from './src/rotas/Rotas';
import {name as appName} from './app.json';
import Provider from './src/data/Provider';

const App = () => (
  <Provider>
    <Rotas />
  </Provider>
);

AppRegistry.registerComponent(appName, () => App);
