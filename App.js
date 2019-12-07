import React, { useEffect, useState } from 'react';
import { AppLoading } from 'expo';
import { Container, Text, Header } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AppNavigation } from './src/navigation';
import GlobalContext from './src/context/globalContext';
import { createDatabase } from './src/db';
import * as FileSystem from 'expo-file-system';

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
      console.log(FileSystem.documentDirectory);
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
