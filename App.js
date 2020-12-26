import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Container } from 'native-base';
import React, { useEffect, useState } from 'react';
import GlobalContext from './src/context/globalContext';
import { createDatabase } from './src/db';
import { AppNavigation } from './src/navigation';

const App = props => {
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      return await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      });
    }

    if (!isReady) {
      loadFonts();
      createDatabase();
      setReady(true);
    }
  }, []);

  if (!isReady) {
    return <AppLoading />;
  }

  return (
    <Container>
      <GlobalContext>
        <AppNavigation />
      </GlobalContext>
    </Container>
  );
};

export default App;
